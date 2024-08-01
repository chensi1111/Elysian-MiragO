<template>
  <div v-if="loading">加載中...</div>
  <div class="empty" v-else-if="!sortedOrders.length">查無訂單記錄</div>
  <div class="order" v-for="order in sortedOrders" :key="order.id">
    <el-collapse>
      <el-collapse-item>
        <template #title>
          <div class="orderTitle">
            <div class="orderID">{{ order.id }}</div>
            <div class="orderTime">{{ order.time }}</div>
          </div>
        </template>
        <div
          class="orderProduct"
          v-for="(product, index) in order.order"
          :key="index"
        >
          <div class="pic">
            <img :src="product.img" />
          </div>
          <div class="content">
            <div class="name">{{ product.name }}</div>
            <div class="details">
              <div class="detail">顏色 : {{ product.color }}</div>
              <div class="detail">尺寸 : {{ product.size }}</div>
            </div>
            <div class="prices">
              <div class="price">TWD{{ formattedPrice(product.price) }}</div>
              <div class="quantity">x{{ product.quantity }}</div>
              <div class="total">
                TWD{{ formattedPrice(getTotalPrice(product)) }}
              </div>
            </div>
          </div>
        </div>
        <div class="totalContainer">
          <div class="states">
            <div class="cancle" @click="cancleOrder(order)" v-if="order.state!=='訂單已取消'">
              <i class="fa-solid fa-trash-can"></i>取消訂單
            </div>
            <div class="state">{{ order.state }}</div>
            <div class="refund">退款處理中</div>
          </div>
          <div class="totalPrice">總價 : {{ formattedPrice(order.total) }}</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
export default {
  name: "TheOrders",
};
</script>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/services/firebase.js";
import { ElMessageBox, ElMessage } from "element-plus";
import { useCurrentOrderStore } from "@/stores/currentOrder";

const loading = ref(true);

//firestore
const auth = getAuth();
const currentUser = ref();
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser.value = user;
    getUserOrders(user);
  }
});
const userOrders = ref();

const getUserOrders = async (user: any) => {
  if (user) {
    const ordersCollection = collection(db, "users", user.uid, "orders");
    const orderSnapshot = await getDocs(ordersCollection);
    userOrders.value = orderSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
};

//篩選訂單
const currentOrder=useCurrentOrderStore()
const filteOrders=computed(()=>{
  //避免直接對undefined進行篩選
  if (!Array.isArray(userOrders.value)) {
        return [];
    }
  if(currentOrder.orderType=='處理中訂單'){
    return userOrders.value.filter((order:any) => order.state === '訂單處理中');
  }
  if(currentOrder.orderType=='已完成訂單'){
    return userOrders.value.filter((order:any) => order.state === '訂單已完成');
  }
  if(currentOrder.orderType=='已取消訂單'){
    return userOrders.value.filter((order:any) => order.state === '訂單已取消');
  }
  return userOrders.value
})

// 對訂單進行排序
const sortedOrders = ref();

function sortOrders(orders: any) {
  return [...orders].sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
}

watch(filteOrders, (newOrders) => {
  sortedOrders.value = sortOrders(newOrders);
});

onMounted(async () => {
  if (currentUser.value) {
    await getUserOrders(currentUser.value);
  }
  currentOrder.orderType='處理中訂單'
  loading.value = false;
});

//給金額的千位加上頓號
function formattedPrice(price: number) {
  return price.toLocaleString();
}

//計算價錢
function getTotalPrice(product: any) {
  let totalPriceForProduct = 0;

  const discountBundles = Math.floor(product.quantity / 3); // 可以享受 8 折的组数
  const nonDiscountQuantity = product.quantity % 3; // 不享受折扣的商品数量

  totalPriceForProduct += discountBundles * 3 * product.price * 0.8;
  totalPriceForProduct += nonDiscountQuantity * product.price;

  return totalPriceForProduct;
}

//修改size的形式
function getProductSize(item: any): string {
  switch (item.size) {
    case "32A":
      return "size32A";
    case "32B":
      return "size32B";
    case "32C":
      return "size32C";
    case "32D":
      return "size32D";
    case "34A":
      return "size34A";
    case "34B":
      return "size34B";
    case "34C":
      return "size34C";
    case "34D":
      return "size34D";
    case "36A":
      return "size36A";
    case "36B":
      return "size36B";
    case "36C":
      return "size36C";
    case "36D":
      return "size36D";
    case "24":
      return "size24";
    case "25":
      return "size25";
    case "26":
      return "size26";
    default:
      return item.size;
  }
}

//取消訂單
function cancleOrder(orderData: any) {
  if (currentUser.value) {
    const orderDocRef = doc(
      db,
      "users",
      currentUser.value.uid,
      "orders",
      orderData.id
    );
    ElMessageBox.confirm(`確定要取消訂單嗎`, "Warning", {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    })
      .then(async () => {
        // 更新庫存
        const batch = writeBatch(db);
        batch.update(orderDocRef, { state: "訂單已取消" });

        for (const product of orderData.order) {
          const collectionName =
            product.category === "man"
              ? "manClothes"
              : product.category === "woman"
              ? "womanClothes"
              : "accessory";
          const productRef = doc(db, collectionName, product.id);
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            const currentStock = productDoc.data();
            if (currentStock[getProductSize(product)] !== undefined) {
              const newStock =
                currentStock[getProductSize(product)] + product.quantity;
              batch.update(productRef, {
                [getProductSize(product)]: newStock,
              });
            }
          }
        }

        await batch.commit();

        // 重新獲取訂單數據
        getUserOrders(currentUser.value);
        ElMessage({
          type: "success",
          message: "訂單已取消",
        });
      })
      .catch(() => {
        ElMessage({
          type: "warning",
          message: "訂單取消失敗",
        });
      });
  }
}
</script>

<style scoped>
.el-collapse {
  --el-collapse-header-bg-color: transparent;
  --el-collapse-content-bg-color: transparent;
  border-bottom: unset;
  border-top: unset;
  --el-collapse-border-color: rgba(40, 40, 40, 0.8);
}

.orderTitle {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
}

.orderTime {
  font-size: 14px;
}

.orderProduct {
  display: flex;
  font-size: 16px;
}

.pic {
  width: 20%;
}

img {
  width: 100%;
}

.prices {
  display: flex;
  justify-content: space-between;
}

.content {
  width: 80%;
  padding: 10px 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name {
  font-weight: bold;
}

.details {
  display: flex;
  flex-direction: column;
}

.totalContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.states {
  display: flex;
}
.state{
    margin-left: 10px;
    color: red;
}
.refund{
  margin-left: 10px;
}
i {
  margin-right: 5px;
}

.cancle:hover {
  cursor: pointer;
}

@media screen and (max-width: 767px) {
  .orderTitle {
    flex-wrap: wrap;
    padding: 5px 0;
  }

  .el-collapse {
    --el-collapse-header-height: unset;
    padding-bottom: 15px;
  }

  .detail,
  .quantity,
  .price,
  .total {
    font-size: 14px;
  }

  .content {
    padding: 0 5px 10px 5px;
  }

  .pic {
    width: 25%;
  }

  .cancle,
  .totalPrice,
  .state,
  .refund {
    font-size: 16px;
  }
}
@media screen and (max-width:414px){
  .cancle,
  .totalPrice,
  .state,
  .refund {
    font-size: 14px;
    margin-left: 5px;
  }
  .empty{
    font-size: 14px;
  }
}
</style>

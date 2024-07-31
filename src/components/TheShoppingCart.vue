<template>
    <div class="container" :style="{ right: shoppingCartOpen ? '0' : shoppingCartWidth }" @mouseleave="closeCart"
        @mouseover="clearCartTimeOut" v-if="windowWidth>767">
        <div class="cancle" @click="closeCart">X</div>
        <div class="info">
            <div class="title">購物車</div>
            <div class="list">
                <el-scrollbar>
                    <div class="remind" v-show="!cartItems.length" @click="toClothes('')">您的購物車為空<br>點我馬上選購</div>
                    <div class="product" v-for="item in cartItems" :key="item.name">
                        <div class="delete fa-regular fa-trash-can" @click="removeItem(item.name, item.size,item.color)"></div>
                        <div class="pic"><img :src=item.img></div>
                        <div class="detail">
                            <div class="name">{{ item.name }}</div>
                            <div class="data">顏色 : {{ item.color }}</div>
                            <div class="data">尺碼 : {{ item.size }}</div>
                            <div class="stock" v-if="item.stock>=5">尚有庫存</div>
                            <div class="stock less" v-if="item.stock<5 && item.stock>0">少量庫存{{ item.stock }}</div>
                            <div class="stock empty" v-if="item.stock==0">無庫存</div>
                            <div class="bottom">
                                <div class="price" :style="{ textDecoration: (item.stock) ? 'none' : 'line-through' }">
                                    ${{formattedPrice(item.price) }}
                                </div>
                                <span>X</span>
                                <div class="quantity"
                                    :style="{ textDecoration: (item.stock) ? 'none' : 'line-through' }">{{item.quantity }}
                                </div>
                                <div class="calcs">
                                    <div class="calc fa-solid fa-plus" @click="plusItem(item.name, item.size,item.color)"></div>
                                    <div class="calc fa-solid fa-minus" @click="minusItem(item.name, item.size,item.color)"></div>
                                </div>
                            </div>
                            <div class="productPrice">總價 : 
                                <span :style="{ textDecoration: (item.quantity > 2) ? 'line-through' : 'none' }">${{formattedPrice(item.price * item.quantity) }}</span>
                                <span v-show="item.quantity > 2">${{formattedPrice( getTotalPrice(item) )}}</span>
                                <div class="sale" v-show="item.quantity > 2">3件8折</div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="total">
                <div class="count">
                    <span>總計</span>
                    <div class="totalQuantity">({{ totalQuantity }})商品</div>
                </div>
                <div class="totalPrice">${{ formattedPrice(totalPrice) }}</div>
            </div>
            <div class="button" @click="toShoppingCart">查看購物車</div>
            <div class="pay" @click="toConfirm">結帳</div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "TheShoppingCart",
};
</script>

<script setup lang="ts">
import { ref, watch,onMounted,onBeforeUnmount, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useShoppingCartStore } from '@/stores/shoppingCart';
import { useProductFilterStore } from '@/stores/productFilter';
import { useCurrentGenderStore } from '@/stores/currentGender';
import { useRouter ,useRoute} from 'vue-router';
import { ElMessageBox,ElMessage } from 'element-plus';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const shoppingCartStore = useShoppingCartStore();
const { shoppingCartOpen } = storeToRefs(shoppingCartStore);
const cartItems = ref(shoppingCartStore.cartItems);
const totalQuantity = ref(shoppingCartStore.totalQuantity);
const totalPrice = ref(shoppingCartStore.totalPrice);

//給金額的千位加上頓號
function formattedPrice(price:number){
    return price.toLocaleString()
}

function plusItem(name: string, size: string,color:string) {
    shoppingCartStore.plusItem(name, size,color);
}
function minusItem(name: string, size: string,color:string) {
    shoppingCartStore.minusItem(name, size,color)
}

function removeItem(name: string, size: string, color:string) {
    shoppingCartStore.removeItem(name, size,color)
}
function closeCart() {
    shoppingCartStore.closeCart()
}

function clearCartTimeOut() {
    shoppingCartStore.clearCloseCartTimeout()
}

function getTotalPrice(item: any) {
    let totalPriceForItem = 0;
    
    const discountBundles = Math.floor(item.quantity / 3); // 可以享受 8 折的组数
    const nonDiscountQuantity = item.quantity % 3; // 不享受折扣的商品数量

    totalPriceForItem += discountBundles * 3 * item.price * 0.8;
    totalPriceForItem += nonDiscountQuantity * item.price;
   
    return totalPriceForItem;
}



watch([() => shoppingCartStore.cartItems, () => shoppingCartStore.totalQuantity, () => shoppingCartStore.totalPrice], ([newCartItems, newTotalQuantity, newTotalPrice]) => {
    cartItems.value = newCartItems;
    totalQuantity.value = newTotalQuantity;
    totalPrice.value = newTotalPrice;
});

// 若庫存量小於訂購量，則訂購量改為庫存量
watch(() => shoppingCartStore.cartItems, (newCartItems) => {
    newCartItems.forEach(item => {
        if (item.stock < item.quantity) {
            item.quantity = item.stock;
        }
    });
    cartItems.value = newCartItems;
}, { deep: true, immediate: true });

const router=useRouter()
const route=useRoute()
const productFilterStore=useProductFilterStore()
const currentGenderStore=useCurrentGenderStore()
const auth = getAuth()
const currentUser = ref()
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser.value = user
    }
});

function toClothes(filter: string|string[]) {
  productFilterStore.isSale=false
  if (currentGenderStore.currentGender === 'man') {
    router.push({
      path: "/man/clothes",
    });
    productFilterStore.typeFilter = filter
  } else {
    router.push({
      path: "/woman/clothes",
    });
    productFilterStore.typeFilter = filter
  }
}

function toShoppingCart(){
    router.push({
        path:'/shoppingCart'
    })
}

function toConfirm() {
    if(cartItems.value.length){
        if (currentUser.value) {
        router.push({
            path: '/confirm'
        })
    } else {
        ElMessageBox.confirm(
            `請先登入會員`,
            'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        ).then(() => {
            router.push({
                path: '/login',
                query: { redirect: route.fullPath }
            })
        })
            .catch(() => {
                ElMessage({
                    type: 'warning',
                    message: '已取消',
                })
            })
    }
    }else{
        ElMessageBox.confirm(
            `購物車為空`,
            'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        )
    }
    
}

const windowWidth = ref(window.innerWidth);
const shoppingCartWidth=computed(()=>{
    if(windowWidth.value<=1024){
        return '-40%'
    }
    return '-30%'
})
function updateWindowWidth() {
    windowWidth.value = window.innerWidth;
}

onMounted(() => {
    window.addEventListener('resize', updateWindowWidth);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWindowWidth);
});
</script>

<style scoped>
.container {
    position: fixed;
    width: 30%;
    height: 100vh;
    padding: 30px 50px;
    box-sizing: border-box;
    top: 0;
    right: 0;
    background-color: black;
    z-index: 1000;
    transition: 0.3s;
}

.info {
    height: 100%;
    color: white;
}

.title {
    font-size: 20px;
    font-weight: bold;
}

.list {
    border: 1px solid white;
    height: 70%;
    margin-top: 20px;
    position: relative;
}
.remind{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center
}
.remind:hover{
    cursor: pointer;
    text-decoration: underline;
}
.product {
    display: flex;
    padding: 10px 0;
    position: relative;
    border-bottom: 1px solid gray;
}

.pic {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
}

img {
    width: 80%
}

.delete {
    position: absolute;
    top: 10px;
    right: 10px;
}

.delete:hover {
    cursor: pointer;
}

.detail {
    width: 55%;
    display: flex;
    flex-direction: column;
}

.name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}

.data {
    font-size: 14px;
    color: gray;
}

.stock {
    width: 50%;
    border: 1px solid green;
    color: green;
    padding: 3px;
    margin: 5px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.stock.less {
    border: 1px solid rgb(255, 100, 0);
    color: rgb(255, 100, 0);
}
.stock.empty {
    border: 1px solid red;
    color: red;
}

.bottom {
    display: flex;
    align-items: center;
}

.bottom span {
    font-size: 12px;
    margin: 0 10px;
}

.calcs {
    font-size: 12px;
    margin-left: 25px;
}

.calc {
    margin-right: 10px
}

.calc:hover {
    cursor: pointer;
}

.productPrice span {
    margin-right: 10px;
}

.sale {
    color: red;
    font-size: 14px;
}

.total {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    height: 5%;
    border-bottom: 1px solid gray;
    padding-bottom: 5px;
    margin-top: 5px;
}

.count {
    display: flex
}

.count span {
    margin-right: 30px;
}

.totalQuantity {
    color: gray;
}

.button {
    background-color: green;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    height: 10%;
    margin: 10px 0;
}

.button:hover {
    cursor: pointer;
    background-color: rgb(0, 170, 0);
}

.pay {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    height: 5%;
}

.pay:hover {
    cursor: pointer;
    text-decoration: underline;
}

.cancle {
    position: absolute;
    top: 30px;
    right: 30px;
    color: white;
    font-size: 18px;
}

.cancle:hover {
    cursor: pointer;
}

::v-deep .el-scrollbar__thumb {
    background-color: white;
    opacity: 0.5;
    width: 10px !important;
}
@media screen and (max-width:1024px){
    .container{
        padding: 10px;
        width: 40%
    }
    .name{
        font-size: 14px;
    }
}
</style>
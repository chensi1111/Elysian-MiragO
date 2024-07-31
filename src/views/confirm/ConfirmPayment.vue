<template>
    <div class="container">
        <div class="title">結帳</div>
        <div class="details">
            <div class="sub-title">詳細資訊</div>
            <div class="detail">信箱</div>
            <div class="info">{{ email }}</div>
            <div class="detail">聯絡資訊</div>
            <div class="info">{{ fullName }}</div>
            <div class="info">{{ phone }}</div>
            <div class="detail">配送地址</div>
            <div class="info">{{ country }}{{ district }}</div>
            <div class="info">{{ address }}</div>
            <div class="detail">配送方式</div>
            <div class="info">{{ shipping }}</div>
        </div>
        <div class="sub-title">付款方式</div>
        <div class="details active">
            <div class="detail">信用卡</div>
            <div class="credict">
                <div class="topic">信用卡付款</div>
                <div class="info-container">
                    <div class="top">
                        <div class="card-title">信用卡號</div>
                        <el-input placeholder="0000 0000 0000 0000" v-model="cardNumber" maxlength="19"
                            @input="formatCardNumber"></el-input>
                        <div class="error" v-show="!cardNumberValid">此欄不得為空</div>
                        <div class="error" v-show="!cardNumberFormat">請輸入正確格式</div>
                    </div>
                    <div class="bottom">
                        <div class="card">
                            <div class="card-title">有效期限</div>
                            <el-input placeholder="MM/YY" v-model="cardValidDate" maxlength="5"
                                @input="formatCardValidDate"></el-input>
                            <div class="error" v-show="!cardValidDateValid">此欄不得為空</div>
                            <div class="error" v-show="!cardValidDateFormat">請輸入正確格式</div>
                        </div>
                        <div class="card">
                            <div class="card-title">安全碼</div>
                            <el-input placeholder="000" v-model="cardSafeNumber" maxlength="3"></el-input>
                            <div class="error" v-show="!cardSafeNumberValid">此欄不得為空</div>
                            <div class="error" v-show="!cardSafeNumberFormat">請輸入正確格式</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="confirm" @click="toComplete">下一步 : 下訂單</div>
    </div>
</template>

<script setup lang='ts'>

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc,writeBatch } from "firebase/firestore";
import { db } from "@/services/firebase.js";
import { useShoppingCartStore } from '@/stores/shoppingCart';
import { nanoid } from 'nanoid';

//firestore
const auth = getAuth()
const currentUser = ref()
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser.value = user
    }
});

//下單時間
function getOrderTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

//修正後的產品
const shoppingCartStore = useShoppingCartStore()
const finalProducts = shoppingCartStore.cartItems.map(item => {
    return {
        name: item.name,
        price: item.price,
        img: item.img,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        category: item.category,
        id: getProductID(item.id)
    };
});

//修改ID的形式
function getProductID(number: number) {
    const result = number % 1000; // 去掉千位數後的數字
    return result.toString().padStart(3, '0'); // 將結果轉換為字符串
}

//修改size的形式
function getProductSize(item: any): string {
    switch (item.size) {
        case '32A':
            return 'size32A';
        case '32B':
            return 'size32B';
        case '32C':
            return 'size32C';
        case '32D':
            return 'size32D';
        case '34A':
            return 'size34A';
        case '34B':
            return 'size34B';
        case '34C':
            return 'size34C';
        case '34D':
            return 'size34D';
        case '36A':
            return 'size36A';
        case '36B':
            return 'size36B';
        case '36C':
            return 'size36C';
        case '36D':
            return 'size36D';
        case '24':
            return 'size24';
        case '25':
            return 'size25';
        case '26':
            return 'size26';
        default:
            return item.size;
    }
}

//表單路由資料
const route = useRoute()
const email = route.query.email
const firstName = route.query.firstName as string
const lastName = route.query.lastName as string
const fullName = computed(() => {
    return firstName + lastName
})
const phone = route.query.phone
const country = route.query.country
const district = route.query.district
const address = route.query.address
const shipping = route.query.shipping

//信用卡資料
const cardNumber = ref()
const cardValidDate = ref()
const cardSafeNumber = ref()
const cardNumberValid = ref(true)
const cardValidDateValid = ref(true)
const cardSafeNumberValid = ref(true)
const cardNumberFormat = ref(true)
const cardValidDateFormat = ref(true)
const cardSafeNumberFormat = ref(true)

//格式化卡號
function formatCardNumber() {
    cardNumber.value = cardNumber.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').replace(/(.{4})/g, '$1 ').trim();
}

//格式化有效期限
function formatCardValidDate() {
    cardValidDate.value = cardValidDate.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').replace(/(.{2})(?=.)/g, '$1/').trim();
}

//檢查月份
function isValidMonth(month: string) {
    const monthNum = parseInt(month, 10);
    return monthNum >= 1 && monthNum <= 12;
}

//路由
const router = useRouter()
const orderId = nanoid();
async function toComplete() {
    cardNumberValid.value = !!cardNumber.value
    cardValidDateValid.value = !!cardValidDate.value
    cardSafeNumberValid.value = !!cardSafeNumber.value

    const cardDate = cardValidDate.value.split('/');

    if (cardNumber.value.length === 19) {
        cardNumberFormat.value = true
    } else {
        cardNumberFormat.value = false
    }
    if (cardValidDate.value.length === 5 && isValidMonth(cardDate[0])) {
        cardValidDateFormat.value = true
    } else {
        cardValidDateFormat.value = false
    }
    if (cardSafeNumber.value.length === 3) {
        cardSafeNumberFormat.value = true
    } else {
        cardSafeNumberFormat.value = false
    }
    if (cardNumberValid.value && cardValidDateValid.value && cardSafeNumberValid.value && cardNumberFormat.value && cardValidDateFormat.value && cardSafeNumberFormat.value) {
        try {
            // 開始批次操作
            const batch = writeBatch(db);
            
            // 設置訂單
            const orderDocRef = doc(db, "users", currentUser.value.uid, "orders", orderId);
            batch.set(orderDocRef, {
                order: finalProducts,
                total: shoppingCartStore.totalPrice,
                time: getOrderTime()
            });
            
            // 更新每個產品的庫存
            for (const item of finalProducts) {
                const collectionName = item.category === 'man' ? 'manClothes' :
                                       item.category === 'woman' ? 'womanClothes' : 'accessory';
                const productRef = doc(db, collectionName, item.id);
                const productDoc = await getDoc(productRef);
                
                if (productDoc.exists()) {
                    const currentStock = productDoc.data();
                    if (currentStock[getProductSize(item)] >= item.quantity) {
                        const newStock = currentStock[getProductSize(item)] - item.quantity;
                        batch.update(productRef, { [getProductSize(item)]: newStock });
                    } else {
                        throw new Error(`Insufficient stock for ${item.name} in size ${item.size}`);
                    }
                }
            }
            // 提交批次操作
            await batch.commit();
            shoppingCartStore.cleanCartItems()
            
            // 跳轉到確認頁面
            router.push({
                path: '/confirm/complete'
            });
        } catch (error) {
            console.error("Error completing order: ", error);
            ElMessage({
                message: '訂單處理出錯，請重試',
                type: 'error',
                plain: true,
            });
        }
        
    } else {
        ElMessage({
            message: '請輸入完整資訊',
            type: 'warning',
            plain: true,
        });
    }
}
</script>

<style scoped>
.container {
    width: 60%;
    box-sizing: border-box;
    padding-right: 40px
}

.title {
    font-size: 30px;
    font-weight: bold;
}

.details {
    padding: 20px;
    border: 1px solid gray;
    margin: 20px 0;
    box-sizing: border-box
}

.details.active {
    border: 3px solid black;
}

.sub-title {
    font-size: 25px;
    font-weight: bold;
}

.detail {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
}

.info {
    font-size: 18px;
    color: rgb(80, 80, 80);
}

.credict {
    border: 1px solid gray;
}

.topic {
    background-color: rgba(200, 200, 200, 0.5);
    padding: 15px;
    font-size: 18px;
}

.top {
    margin: 15px 0;
    padding: 0 15px
}

.card-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
}

.bottom {
    margin: 15px 0;
    padding: 0 15px;
    display: flex;
}

.card {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.card:first-child {
    margin-right: 20px
}

.error {
    font-size: 14px;
    color: red;
    margin-top: 5px
}

.confirm {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    background-color: black;
    color: white;
}

.confirm:hover {
    cursor: pointer;
}
@media screen and (max-width:767px){
    .container{
        width: 100%;
        padding: 0;
        order: 1;
    }
    .title{
        font-size: 25px;
    }
    .sub-title{
        font-size: 23px;
    }
}
@media screen and (max-width:414px){
    .topic{
        padding: 10px;
        font-size: 16px
    }
}
</style>
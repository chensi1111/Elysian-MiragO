<template>
    <div class="container">
        <div class="title">訂單總結</div>
        <div class="infos">
            <div class="info">小計</div>
            <div class="price">TWD{{ formattedPrice(totalPrice) }}</div>
        </div>
        <div class="infos">
            <div class="info">運費</div>
            <div class="price">TWD{{ shippingFee }}</div>
        </div>
        <div class="infos total">
            <div class="info">總共</div>
            <div class="price">TWD{{ formattedPrice(totalPrice + shippingFee) }}</div>
        </div>
        <div class="quantity">共{{ totalQuantity }}件</div>
        <div class="product" v-for="(product, index) in products" :key="index">
            <div class="left">
                <img :src="product.img">
            </div>
            <div class="right">
                <div class="name">{{ product.name }}</div>
                <div class="infos">
                    <div class="color">顏色 : {{ product.color }}</div>
                    <div class="size">尺碼 : {{ product.size }}</div>
                </div>
                <div class="prices">
                    <div class="product-price">TWD{{ formattedPrice(product.price) }}</div>
                    <div class="product-quantity">x{{ product.quantity }}</div>
                    <div class="product-total">TWD{{formattedPrice(getTotalPrice(product))}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, watchEffect } from 'vue';
import { useShoppingCartStore } from '@/stores/shoppingCart';
const shoppingCartStore = useShoppingCartStore()

const shippingFee = ref()
const totalPrice = ref()
const totalQuantity = ref()
const products = ref()

watchEffect(() => {
    shippingFee.value = shoppingCartStore.shippingFee
    totalPrice.value = shoppingCartStore.totalPrice
    totalQuantity.value = shoppingCartStore.totalQuantity
    products.value = shoppingCartStore.cartItems
})

//給金額的千位加上頓號
function formattedPrice(price: number) {
    return price.toLocaleString()
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
</script>

<style scoped>
.container {
    width: 50%;
    box-sizing: border-box;
}

.title {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid gray;
    padding-bottom: 20px
}

.infos {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
}

.infos.total {
    border-top: 1px solid gray;
}

.info {
    font-size: 18px;
}

.price {
    font-weight: bold;
}

.quantity {
    font-size: 18px;
    margin: 15px 0;
}

.product {
    display: flex;
    margin-bottom: 10px;
}

.left {
    width: 150px;
}

img {
    width: 100%;
}

.right {
    padding-left: 10px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between
}

.right .name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}
.right .infos{
    display: flex;
    flex-direction: column;
}
.prices{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
}
.product-quantity{
    width: 30px;
    text-align: center;
}
.product-total{
    font-weight: bold;
}
@media screen and (max-width:767px){
    .container{
        width: 100%;
    }
}
@media screen and (max-width:414px){
    .price,.product-price,.product-total{
        font-size: 14px;
    }
}
</style>
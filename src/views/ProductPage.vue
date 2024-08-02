<template>
    <div class="container">
        <div class="left">
            <div class="pic">
                <img :src="product.originalImg || product.img">
            </div>
            <div class="pic">
                <img :src="product.img2">
            </div>
        </div>
        <div class="right">
            <div class="infos">
                <div class="name">{{ product.name }}</div>
                <div class="prices">
                    <div class="price" :style="{ textDecoration: product.sale ? 'line-through' : 'none' }">TWD{{
                        product.price }}</div>
                    <div class="price" v-if="product.sale">TWD{{ product.price * 0.5 }}</div>
                    <div class="discount" v-if="product.sale">5折</div>
                </div>
                <div class="discount">3件8折</div>
                <div class="info">顏色 : <span>{{ getColorName(product.color) }}</span></div>
                <div class="colors">
                    <div v-for="color in productColors" :key="color" :class="['color', color]"
                        @click="changeColor(color)">
                    </div>
                </div>
                <div class="info">尺寸 : <span>{{ confirmSize }}</span></div>
                <div class="sizes">
                    <div class="size" v-if="product.sizeXS !== undefined" @click="showSize('XS')"
                        :class="{ selected: confirmSize == 'XS' }">XS</div>
                    <div class="size" v-if="product.sizeS !== undefined" @click="showSize('S')"
                        :class="{ selected: confirmSize == 'S' }">S</div>
                    <div class="size" v-if="product.sizeM !== undefined" @click="showSize('M')"
                        :class="{ selected: confirmSize == 'M' }">M</div>
                    <div class="size" v-if="product.sizeL !== undefined" @click="showSize('L')"
                        :class="{ selected: confirmSize == 'L' }">L</div>
                    <div class="size" v-if="product.sizeXL !== undefined" @click="showSize('XL')"
                        :class="{ selected: confirmSize == 'XL' }">XL</div>
                    <div class="size onesize" v-if="product.onesize !== undefined" @click="showSize('onesize')"
                        :class="{ selected: confirmSize == 'onesize' }">onesize</div>
                    <div class="size" v-if="product.size25 !== undefined" @click="showSize('25')"
                        :class="{ selected: confirmSize == '25' }">25</div>
                    <div class="size" v-if="product.size26 !== undefined" @click="showSize('26')"
                        :class="{ selected: confirmSize == '26' }">26</div>
                    <div class="size" v-if="product.size27 !== undefined" @click="showSize('27')"
                        :class="{ selected: confirmSize == '27' }">27</div>
                    <div class="size" v-if="product.size32A !== undefined" @click="showSize('32A')"
                        :class="{ selected: confirmSize == '32A' }">32A</div>
                    <div class="size" v-if="product.size32B !== undefined" @click="showSize('32B')"
                        :class="{ selected: confirmSize == '32B' }">32B</div>
                    <div class="size" v-if="product.size32C !== undefined" @click="showSize('32C')"
                        :class="{ selected: confirmSize == '32C' }">32C</div>
                    <div class="size" v-if="product.size32D !== undefined" @click="showSize('32D')"
                        :class="{ selected: confirmSize == '32D' }">32D</div>
                    <div class="size" v-if="product.size34A !== undefined" @click="showSize('34A')"
                        :class="{ selected: confirmSize == '34A' }">34A</div>
                    <div class="size" v-if="product.size34B !== undefined" @click="showSize('34B')"
                        :class="{ selected: confirmSize == '34B' }">34B</div>
                    <div class="size" v-if="product.size34C !== undefined" @click="showSize('34C')"
                        :class="{ selected: confirmSize == '34C' }">34C</div>
                    <div class="size" v-if="product.size34D !== undefined" @click="showSize('34D')"
                        :class="{ selected: confirmSize == '34D' }">34D</div>
                    <div class="size" v-if="product.size36A !== undefined" @click="showSize('36A')"
                        :class="{ selected: confirmSize == '36A' }">36A</div>
                    <div class="size" v-if="product.size36B !== undefined" @click="showSize('36B')"
                        :class="{ selected: confirmSize == '36B' }">36B</div>
                    <div class="size" v-if="product.size36C !== undefined" @click="showSize('36C')"
                        :class="{ selected: confirmSize == '36C' }">36C</div>
                    <div class="size" v-if="product.size36D !== undefined" @click="showSize('36D')"
                        :class="{ selected: confirmSize == '36D' }">36D</div>
                </div>
                <div class="remind" v-if="!isChoose">選擇尺寸以查看庫存</div>
                <div class="stock" v-if="confirmSizeProduct >= 5">尚有庫存</div>
                <div class="stock less" v-if="confirmSizeProduct > 0 && confirmSizeProduct < 5">較少庫存</div>
                <div class="stock empty" v-if="confirmSizeProduct === 0">庫存不足</div>
                <div class="buttons">
                    <div class="add" @click="selectSize(product, confirmSize, confirmSizeProduct)">新增至購物車</div>
                    <div class="favorite" :class="['fa-heart', product.favorite ? 'fa-solid' : 'fa-regular']"
                        @click="toggleFavorite(product)">
                    </div>
                </div>
                <div class="detail"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useCurrentGenderStore } from '@/stores/currentGender';
import { useProductsInfoStore } from '@/stores/productsInfo';
import { useFavoriteProductStore } from '@/stores/favoriteProduct';
import { useShoppingCartStore } from '@/stores/shoppingCart';
import { ElMessageBox } from 'element-plus';

const route = useRoute()
const currentGenderStore = useCurrentGenderStore()
const productsInfoStore = useProductsInfoStore()
const favoriteProductStore = useFavoriteProductStore()
const productData = route.query
const product = ref()
const productColors = ref()

watchEffect(() => {
    product.value = {
        ...productData,
        id: Number(productData.id),
        favorite: productData.favorite === 'true' // 將字符串轉換為布爾類型
    };

    if (typeof productData.availableColors === 'string') {
        productColors.value = [productData.availableColors];
    } else {
        productColors.value = productData.availableColors;
    }
});

function getColorName(color: string) {
    switch (color) {
        case 'Black':
            return "黑色";
        case 'White':
            return "白色";
        case 'Blue':
            return "藍色";
        case 'Green':
            return "綠色";
        case 'Brown':
            return "棕色";
        case 'Gray':
            return "灰色";
        case 'Red':
            return "紅色";
        case 'Pink':
            return "粉色";
        case 'Yellow':
            return "黃色";
        default:
            return "";
    }
}

const isChoose = ref(false)
const confirmSize = ref()
function showSize(size: string) {
    confirmSize.value = size
    isChoose.value = true
}
const confirmSizeProduct = computed(() => {
    switch (confirmSize.value) {
        case 'XS':
            return product.value.sizeXS;
        case 'S':
            return product.value.sizeS;
        case 'M':
            return product.value.sizeM;
        case 'L':
            return product.value.sizeL;
        case 'XL':
            return product.value.sizeX;
        case 'onesize':
            return product.value.onesize;
        case '25':
            return product.value.size25;
        case '26':
            return product.value.size26;
        case '27':
            return product.value.size27;
        case '32A':
            return product.value.size32A;
        case '32B':
            return product.value.size32B;
        case '32C':
            return product.value.size32C;
        case '32D':
            return product.value.size32D;
        case '34A':
            return product.value.size34A;
        case '34B':
            return product.value.size34B;
        case '34C':
            return product.value.size34C;
        case '34D':
            return product.value.size34D;
        case '36A':
            return product.value.size36A;
        case '36B':
            return product.value.size36B;
        case '36C':
            return product.value.size36C;
        case '36D':
            return product.value.size36D;
        default:
            return "";
    }
})

//切換顏色
function changeColor(color: string) {
    const productStorage = ref()
    if (currentGenderStore.currentGender === "man") {
        productStorage.value = productsInfoStore.manProductList
    } else {
        productStorage.value = productsInfoStore.womanProductList
    }

    // 找到對應顏色的產品
    const newProduct = productStorage.value.find((p: any) => p.name === product.value.name && p.color === color);
    if (newProduct) {
        // 更新當前顏色選擇
        product.value = newProduct;
        console.log(newProduct, "change")
    }
}

//切換favorite狀態
function toggleFavorite(product: any) {
    product.favorite = !product.favorite
    favoriteProductStore.toggleFavorite(product)
    updateLocalStorage(product)
    shoppingCartStore.loadFromLocalStorage()
}

// 更新localstorage中的favorite狀態
const updateLocalStorage = (product: any) => {
    let favoriteStatus = localStorage.getItem('favoriteStatus');
    let favoriteStatusObj = favoriteStatus ? JSON.parse(favoriteStatus) : {};
    favoriteStatusObj[product.id] = product.favorite;

    // 保存更新後的 favoriteStatus 回到 localStorage
    localStorage.setItem('favoriteStatus', JSON.stringify(favoriteStatusObj));
};
const loadLocalStorage = () => {
    // 從 localStorage 中獲取 favoriteStatus
    const favoriteStatus = localStorage.getItem('favoriteStatus');
    if (favoriteStatus) {
        const favoriteStatusObj = JSON.parse(favoriteStatus);
        product.value.favorite = favoriteStatusObj[product.value.id];
    }
};

//添加至購物車
const shoppingCartStore = useShoppingCartStore()
const selectSize = (product: any, size: string, stock: number) => {
    if (!confirmSize.value) {
        ElMessageBox.alert('請選擇尺寸', '提示', {
            confirmButtonText: 'OK',
        })
    } else {
        const calculatedPrice = product.sale ? product.price * 0.5 : product.price;
        const selectedProduct = {
            ...product, 
            price: calculatedPrice, 
            size, 
            stock, 
            img: product.originalImg || product.img, 
            quantity: 1, 
        };

        shoppingCartStore.addItem(selectedProduct);
        shoppingCartStore.openCart();

        shoppingCartStore.clearCloseCartTimeout();
        shoppingCartStore.closeCartTimeout = setTimeout(() => {
            shoppingCartStore.closeCart();
            shoppingCartStore.closeCartTimeout = null;
        }, 2000);
    }

};
onMounted(() => {
    loadLocalStorage()
})
</script>

<style scoped>
.container {
    display: flex;
    padding: 20px;
    box-sizing: border-box;
}

.left {
    width: 60%;
    display: flex;
}

.pic {
    width: 50%;
    margin-right: 10px;
}

img {
    width: 100%;
}

.right {
    width: 40%;
    padding: 10px 20px;
    box-sizing: border-box;
}

.name {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 15px;
}

.prices {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.price {
    margin-right: 10px;
    font-size: 20px;
}

.discount {
    color: red;
    font-size: 16px;
}

.info {
    margin: 10px 0;
    font-size: 20px;
}

.info span {
    font-weight: bold;
}

.colors {
    display: flex;
}

.color {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-right: 15px;
    border: 1px solid black;
}

.color:hover {
    cursor: pointer;
}

.color.White {
    background-color: white
}

.color.Black {
    background-color: black
}

.color.Blue {
    background-color: blue
}

.color.Brown {
    background-color: brown
}

.color.Red {
    background-color: red
}

.color.Green {
    background-color: green
}

.color.Gray {
    background-color: gray
}

.color.Yellow {
    background-color: yellow
}

.color.Pink {
    background-color: pink
}

.sizes {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px
}

.size {
    margin: 0 10px 10px 0;
    font-size: 18px;
    font-weight: bold;
    border: 1px solid black;
    width: 50px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.size.onesize {
    width: 100px;
}

.size.selected {
    border: 3px solid black;
}

.size:hover {
    cursor: pointer
}

.stock {
    font-size: 20px;
    color: green;
    border: 3px solid green;
    width: 200px;
    box-sizing: border-box;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

}

.stock.less {
    color: rgb(255, 100, 0);
    border: 3px solid rgb(255, 100, 0);
}

.stock.empty {
    color: red;
    border: 3px solid red
}

.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 15px
}

.add {
    width: 100%;
    height: 40px;
    font-size: 20px;
    color: white;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
}

.add:hover {
    cursor: pointer;
}

.favorite {
    font-size: 30px;
    width: 35px;
    height: 35px;
    border-radius: 35px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px
}

.favorite:hover {
    cursor: pointer;
}
@media screen and (max-width:1024px){
    .right{
        padding: 10px;
    }
    .name{
        font-size: 25px;
    }
}
@media screen and (max-width:767px){
    .container{
        flex-direction: column;
    }
    .left{
        flex-direction: column;
        width: 100%;
        order: 1;
    }
    .pic{
        width: 100%;
        margin: 10px 0;
    }
    .right{
        width: 100%;
    }
    .size{
        height: 30px
    }
    .stock{
        height: 30px;
        font-size: 16px;
    }
    .add{
        height: 30px;
        font-size: 16px;
    }
}
@media screen and (max-width:414px){
    .name{
        font-size: 20px;
    }
    .price{
        font-size: 18px;
    }
   .info{
    font-size: 18px;
   }
    
}
</style>
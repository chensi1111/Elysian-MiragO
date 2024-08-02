<template>
    <div class="container">
        <div class="title">購物車({{ products.length }})</div>
        <div class="content">
            <div class="products">
                <div class="remind" v-if="!products.length" @click="toClothes('')">您的購物車為空<br>點我馬上選購</div>
                <div class="product" v-for="product in products" :key="product.id">
                    <div class="left">
                        <div class="pic"><img :src="product.img"></div>
                    </div>
                    <div class="right">
                        <div class="top">
                            <div class="name">{{ product.name }}</div>
                            <div class="cancle" @click="removeProduct(product)"><i class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
                        <div class="types">
                            <div class="color">顏色 : {{ product.color }}</div>
                            <div class="size">尺寸 : {{ product.confirmSize || product.size }}</div>
                            <div class="special">3件8折</div>
                        </div>
                        <div class="mid">
                            <div class="price">TWD{{ formattedPrice(product.price) }}</div>
                            <div class="quantity"><el-input-number :min="1" :max="showConfirmSizeStock(product)"
                                    v-model="product.quantity" /></div>
                            <div class="prices">
                                <div class="totalPrice"
                                    :style="{ textDecoration: product.quantity > 2 ? 'line-through' : 'none' }">
                                    TWD{{ formattedPrice(product.quantity * product.price) }}</div>
                                <div class="totalPrice sale" v-if="product.quantity > 2">TWD{{
                                    formattedPrice(getTotalPrice(product)) }}</div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="stocks">
                                <div class="stock" v-if="showConfirmSizeStock(product) >= 5">尚有庫存</div>
                                <div class="stock less"
                                    v-if="showConfirmSizeStock(product) > 0 && showConfirmSizeStock(product) < 5">較少庫存
                                </div>
                                <div class="stock empty" v-if="showConfirmSizeStock(product) == 0">庫存不足</div>
                            </div>
                            <div class="buttons">
                                <div class="button" @click="chooseSize(product)"><i class="fa-solid fa-pen"></i>修改</div>
                                <div class="button" @click="toggleFavorite(product)"><i
                                        class="fa-solid fa-heart"></i>移至喜愛清單</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="infos">
                <div class="info-title">訂單詳情</div>
                <div class="info-container">
                    <div class="info" v-if="totalOriginalPrice - totalPrice > 0">訂單折扣</div>
                    <div class="info discount" v-if="totalOriginalPrice - totalPrice > 0">TWD{{
                        formattedPrice(totalOriginalPrice - totalPrice) }}</div>
                </div>
                <el-select v-model="shippingWay">
                    <el-option value="宅配">宅配</el-option>
                    <el-option value="到店自取">到店自取</el-option>
                </el-select>
                <div class="info-container">
                    <div class="info">運費(5件免運)</div>
                    <div class="info">TWD{{ shippingFee }}</div>
                </div>
                <div class="info-container">
                    <div class="info">總計</div>
                    <div class="info">TWD{{ formattedPrice(totalPrice + shippingFee) }}</div>
                </div>
                <div class="confirm" @click="toConfirm">結帳</div>
            </div>
        </div>

    </div>

    <el-dialog v-model="dialogVisible" class="dialog-container" :before-close="handleClose">
        <div class="dialog">
            <div class="dialog-pic">
                <div class="arrow-left fa-solid fa-caret-left" v-show="currentIndex" @click="toLeft"></div>
                <div class="images-container">
                    <img :src="dialogPic">
                    <img :src="dialogPic2">
                </div>
                <div class="arrow-right fa-solid fa-caret-right" v-show="!currentIndex" @click="toRight"></div>
            </div>
            <div class="dialog-info">
                <div class="dialog-name">{{ dialogName }}</div>
                <div class="dialog-color">顏色 : <span>{{ dialogColor }}</span></div>
                <div class="color-container">
                    <div v-for="color in availableColors" :key="color" :class="['color', color]"
                        @click="changeColor(dialogName, dialogColor, currentSize, color)">
                    </div>
                </div>
                <div class="dialog-sizes">尺碼 : <span>{{ dialogSize }}</span>
                    <div class="size-container">
                        <div class="dialog-size" @click="showSize('XS')" v-if="sizeXS !== undefined">XS</div>
                        <div class="dialog-size" @click="showSize('S')" v-if="sizeS !== undefined">S</div>
                        <div class="dialog-size" @click="showSize('M')" v-if="sizeM !== undefined">M</div>
                        <div class="dialog-size" @click="showSize('L')" v-if="sizeL !== undefined">L</div>
                        <div class="dialog-size" @click="showSize('XL')" v-if="sizeXL !== undefined">XL</div>
                        <div class="dialog-size onesize" @click="showSize('onesize')" v-if="onesize !== undefined">
                            onesize</div>
                        <div class="dialog-size" @click="showSize('25')" v-if="size25 !== undefined">25</div>
                        <div class="dialog-size" @click="showSize('26')" v-if="size26 !== undefined">26</div>
                        <div class="dialog-size" @click="showSize('27')" v-if="size27 !== undefined">27</div>
                        <div class="dialog-size" @click="showSize('32A')" v-if="size32A !== undefined">32A</div>
                        <div class="dialog-size" @click="showSize('32B')" v-if="size32B !== undefined">32B</div>
                        <div class="dialog-size" @click="showSize('32C')" v-if="size32C !== undefined">32C</div>
                        <div class="dialog-size" @click="showSize('32D')" v-if="size32D !== undefined">32D</div>
                        <div class="dialog-size" @click="showSize('34A')" v-if="size34A !== undefined">34A</div>
                        <div class="dialog-size" @click="showSize('34B')" v-if="size34B !== undefined">34B</div>
                        <div class="dialog-size" @click="showSize('34C')" v-if="size34C !== undefined">34C</div>
                        <div class="dialog-size" @click="showSize('34D')" v-if="size34D !== undefined">34D</div>
                        <div class="dialog-size" @click="showSize('36A')" v-if="size36A !== undefined">36A</div>
                        <div class="dialog-size" @click="showSize('36B')" v-if="size36B !== undefined">36B</div>
                        <div class="dialog-size" @click="showSize('36C')" v-if="size36C !== undefined">36C</div>
                        <div class="dialog-size" @click="showSize('36D')" v-if="size36D !== undefined">36D</div>
                    </div>
                </div>
                <div class="size-info" v-show="!isChoose">選擇尺寸以查看庫存</div>
                <div class="stock" v-if="isChoose && chooseSizeStock >= 5">尚有庫存</div>
                <div class="stock less" v-if="isChoose && chooseSizeStock > 0 && chooseSizeStock < 5">較少庫存</div>
                <div class="stock empty" v-if="isChoose && chooseSizeStock === 0">庫存不足</div>
                <div class="update" @click="updateInfo">更新</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { useShoppingCartStore } from '@/stores/shoppingCart';
import { useFavoriteProductStore } from '@/stores/favoriteProduct';
import { useProductsInfoStore } from '@/stores/productsInfo';
import { useProductFilterStore } from '@/stores/productFilter';
import { useCurrentGenderStore } from '@/stores/currentGender';
import { watchEffect, ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const shoppingCartStore = useShoppingCartStore()
const favoriteProductStore = useFavoriteProductStore()
const productsInfoStore = useProductsInfoStore()
void productsInfoStore;

//資料
const products = ref()
const totalPrice = ref()
const totalOriginalPrice = ref()
const totalQuantity = ref()
const shippingFee = ref()
const shippingWay = ref()
const dialogVisible = ref()

watchEffect(() => {
    products.value = shoppingCartStore.cartItems
    shippingFee.value = shoppingCartStore.shippingFee
    shippingWay.value = shoppingCartStore.shippingWay
    totalPrice.value = shoppingCartStore.totalPrice
    totalOriginalPrice.value = shoppingCartStore.totalOriginalPrice
    totalQuantity.value = shoppingCartStore.totalQuantity
    dialogVisible.value = shoppingCartStore.dialogOpen
})
watch(shippingWay, ((newValue) => {
    shoppingCartStore.shippingWay = newValue
}))
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

//移除商品
function removeProduct(product: any) {
    shoppingCartStore.removeItem(product.name, product.size, product.color)
}

//商品詳細資訊
const availableColors = ref<string[]>([]);
const dialogPic = ref("")
const dialogPic2 = ref("")
const dialogName = ref("")
const dialogColor = ref("")
const dialogSize = ref("")
const currentSize = ref("")
const currentStock = ref()
const sizeXS = ref("")
const sizeS = ref("")
const sizeM = ref("")
const sizeL = ref("")
const sizeXL = ref("")
const onesize = ref("")
const size25 = ref("")
const size26 = ref("")
const size27 = ref("")
const size32A = ref("")
const size32B = ref("")
const size32C = ref("")
const size32D = ref("")
const size34A = ref("")
const size34B = ref("")
const size34C = ref("")
const size34D = ref("")
const size36A = ref("")
const size36B = ref("")
const size36C = ref("")
const size36D = ref("")
const isChoose = ref(false)
const dialogID = ref()
const chooseSizeStock = computed(() => {
    switch (dialogSize.value) {
        case "XS":
            return Number(sizeXS.value);
        case "S":
            return Number(sizeS.value);
        case "M":
            return Number(sizeM.value);
        case "L":
            return Number(sizeL.value);
        case "XL":
            return Number(sizeXL.value);
        case "onesize":
            return Number(onesize.value);
        case "25":
            return Number(size25.value);
        case "26":
            return Number(size26.value);
        case "27":
            return Number(size27.value);
        case "32A":
            return Number(size32A.value);
        case "32B":
            return Number(size32B.value);
        case "32C":
            return Number(size32C.value);
        case "32D":
            return Number(size32D.value);
        case "34A":
            return Number(size34A.value);
        case "34B":
            return Number(size34B.value);
        case "34C":
            return Number(size34C.value);
        case "34D":
            return Number(size34D.value);
        case "36A":
            return Number(size36A.value);
        case "36B":
            return Number(size36B.value);
        case "36C":
            return Number(size36C.value);
        case "36D":
            return Number(size36D.value);
        default:
            return 0;
    }
});

//選擇尺寸
function chooseSize(product: any) {
    dialogVisible.value = true
    dialogPic.value = product.img
    dialogPic2.value = product.img2
    dialogName.value = product.name
    dialogColor.value = product.color
    availableColors.value = product.availableColors
    currentSize.value = product.size
    currentStock.value = product.stock
    sizeXS.value = product.sizeXS
    sizeS.value = product.sizeS
    sizeM.value = product.sizeM
    sizeL.value = product.sizeL
    sizeXL.value = product.sizeXL
    size25.value = product.size25
    size26.value = product.size26
    size27.value = product.size27
    onesize.value = product.onesize
    size32A.value = product.size32A
    size32B.value = product.size32B
    size32C.value = product.size32C
    size32D.value = product.size32D
    size34A.value = product.size34A
    size34B.value = product.size34B
    size34C.value = product.size34C
    size34D.value = product.size34D
    size36A.value = product.size36A
    size36B.value = product.size36B
    size36C.value = product.size36C
    size36D.value = product.size36D
    dialogID.value = product.id
}

//顯示確認尺寸的庫存
function showConfirmSizeStock(product: any) {
    switch (product.confirmSize) {
        case "XS":
            return product.sizeXS;
        case "S":
            return product.sizeS;
        case "M":
            return product.sizeM;
        case "L":
            return product.sizeL;
        case "XL":
            return product.sizeXL;
        case "onesize":
            return product.onesize;
        case "25":
            return product.size25;
        case "26":
            return product.size26;
        case "27":
            return product.size27;
        case "32A":
            return product.size32A;
        case "32B":
            return product.size32B;
        case "32C":
            return product.size32C;
        case "32D":
            return product.size32D;
        case "34A":
            return product.size34A;
        case "34B":
            return product.size34B;
        case "34C":
            return product.size34C;
        case "34D":
            return product.size34D;
        case "36A":
            return product.size36A;
        case "36B":
            return product.size36B;
        case "36C":
            return product.size36C;
        case "36D":
            return product.size36D;
        default:
            return product.stock;
    }
}

//是否顯示尺寸選項
function showSize(size: string) {
    dialogSize.value = size
    isChoose.value = true
}

//關閉產品資訊頁面
function handleClose() {
    isChoose.value = false
    dialogVisible.value = false
    currentIndex.value = 0
    scrollImages()
}

//更新產品資訊
function updateInfo() {
    if (dialogSize.value) {
        shoppingCartStore.switchSize(dialogName.value, dialogColor.value, currentSize.value, dialogSize.value)
        handleClose();
    } else {
        ElMessageBox.confirm(
            `請先選擇尺寸`,
            'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        )
    }

}

//控制圖片輪播顯示
const currentIndex = ref(0);
function toRight() {
    if (currentIndex.value < 1) {
        currentIndex.value += 1;
    }
    scrollImages();
}

function toLeft() {
    if (currentIndex.value > 0) {
        currentIndex.value -= 1;
    }
    scrollImages();
}

function scrollImages() {
    const container = document.querySelector('.images-container') as HTMLElement | null;
    if (container) {
        container.style.transform = `translateX(-${currentIndex.value * 100}%)`;
    }
}

//切換顏色
function changeColor(productName: string, productColor: string, productSize: string, newColor: string) {
    dialogColor.value = newColor
    const newProduct = shoppingCartStore.switchColor(productName, productColor, productSize, newColor)
    chooseSize(newProduct)
    if (shoppingCartStore.closeDialog == true) {
        dialogVisible.value = false
    }
}

//移至喜愛清單
function toggleFavorite(product: any) {
    if (!product.favorite) {
        product.favorite = true
        favoriteProductStore.toggleFavorite(product)
        updateLocalStorage()
        shoppingCartStore.addFavorite(product.name, product.size, product.color)
    } else {
        ElMessage({
            message: '商品已存在喜愛清單',
            type: 'warning',
            plain: true,
        })
    }

}

//localstorage
const updateLocalStorage = () => {
    const existingFavoriteStatus = JSON.parse(localStorage.getItem('favoriteStatus') || '{}');
    const newFavoriteStatus = products.value.reduce((accumulate: any, product: any) => {
        accumulate[product.id] = product.favorite;
        return accumulate;
    }, {});

    // 合併新舊資料
    const mergedFavoriteStatus = { ...existingFavoriteStatus, ...newFavoriteStatus };
    localStorage.setItem('favoriteStatus', JSON.stringify(mergedFavoriteStatus));
};


//路由
const router = useRouter()
const route = useRoute()
const auth = getAuth()
const currentUser = ref()
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser.value = user
    }
});

//確認訂單
function toConfirm() {
    if (products.value.length) {
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
    } else {
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

const productFilterStore = useProductFilterStore()
const currentGenderStore = useCurrentGenderStore()

function toClothes(filter: string) {
    productFilterStore.isSale = false
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
</script>

<style scoped>
.container {
    padding: 30px
}

.title {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 20px
}

.remind {
    font-weight: bold;
    text-align: center;
}

.remind:hover {
    cursor: pointer;
    text-decoration: underline;
}

.content {
    display: flex;
}

.products {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.infos {
    width: 30%;
    margin-left: 20px;
    padding: 10px 20px;
    box-sizing: border-box;
    border-top: 1px solid rgb(200, 200, 200);
}

.info-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px
}

.info-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.el-select {
    margin-bottom: 10px;
}

.info.discount {
    color: red
}

.confirm {
    width: 100%;
    height: 40px;
    background-color: green;
    color: white;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

.confirm:hover {
    cursor: pointer;
}

.product {
    margin-bottom: 10px;
    padding: 10px 0;
    border-top: 1px solid rgb(200, 200, 200);
    display: flex;
}

.left {
    max-width: 200px;
    min-width: 100px;
}

img {
    width: 100%;
}

.right {
    padding-left: 20px;
    width: 100%;
}

.top {
    display: flex;
    justify-content: space-between;
}

.cancle:hover {
    cursor: pointer;
}

.types {
    margin-bottom: 10px;
}

.name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
}

.color,
.size {
    color: rgb(60, 60, 60);
    font-size: 18px;
    margin-bottom: 5px
}

.special {
    font-size: 14px;
    color: red;
}

.mid {
    display: flex;
    justify-content: space-between;
}

.el-input-number {
    width: 100px;
    margin: 0 10px;
}

.price {
    display: flex;
    align-items: center;
}

.prices {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.totalPrice.sale {
    color: red;
}

.bottom {
    margin-top: 10px
}

.stock {
    width: 100px;
    height: 30px;
    border: 2px solid green;
    color: green;
    display: flex;
    justify-content: center;
    align-items: center;
}

.stock.less {
    border: 2px solid rgb(255, 100, 0);
    color: rgb(255, 100, 0)
}

.stock.empty {
    border: 2px solid red;
    color: red;
}

.buttons {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap
}

.button {
    margin: 0 25px 5px 0;
    font-weight: bold;
}

.button i {
    margin-right: 5px
}

.button:hover {
    cursor: pointer
}

.dialog {
    display: flex;
    justify-content: space-between;
    position: relative;
}

.dialog-pic {
    width: 40%;
    display: flex;
    overflow: hidden;
}

.images-container {
    display: flex;
    transition: transform 0.5s ease;
    width: 200%;
}

.images-container img {
    width: 100%;

}

.arrow-left {
    position: absolute;
    top: 50%;
    left: 3%;
    font-size: 30px;
    z-index: 100;
}

.arrow-right {
    position: absolute;
    top: 50%;
    right: 63%;
    font-size: 30px;
    z-index: 100;

}

.arrow-left:hover,
.arrow-right:hover {
    cursor: pointer;
}

img {
    width: 100%
}

.dialog-info {
    width: 50%;
    margin-left: 30px;
}

.dialog-name {
    color: white;
    font-weight: bold;
    font-size: 25px;
    margin-bottom: 10px;
}

.dialog-color,
.dialog-sizes {
    font-size: 18px;
    margin: 10px 0;
}

.color-container {
    display: flex
}

.dialog .color {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-right: 15px;
    border: 1px solid white;
}

.dialog .color:hover {
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

.dialog span {
    color: white;
    margin-left: 10px;
}

.dialog-sizes {
    display: flex;
    flex-wrap: wrap;
}

.size-container {
    display: flex;
    flex-wrap: wrap;
    margin: 15px 0 5px;
    width: 100%;
}

.dialog-size {
    width: 50px;
    height: 40px;
    border: 1px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    color: white;
    margin: 0 15px 10px 0;
}

.dialog-size.onesize {
    width: 80px;
}

.dialog-size:hover {
    background-color: rgba(128, 128, 128, 0.5);
    cursor: pointer
}

.size-info {
    color: white;
    font-size: 14px;
    position: relative;
}



.update {
    width: 100px;
    height: 30px;
    background-color: white;
    color: black;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.update:hover {
    cursor: pointer;
    background-color: rgb(180, 180, 180)
}

@media screen and (max-width:1024px) {
    .el-input-number {
        width: 80px;
    }

    ::v-deep .el-input-number .el-input__wrapper {
        padding: 0 5px !important;
    }

    ::v-deep .el-input-number__decrease,
    ::v-deep .el-input-number__increase {
        width: 20px;
    }

    .price,
    .totalPrice {
        font-size: 14px;
    }

    .color,
    .size {
        font-size: 16px;
    }

    .stock {
        height: 25px;
    }

}

@media screen and (max-width:767px) {
    .container {
        padding: 20px;
    }

    .content {
        flex-direction: column
    }

    .products,
    .infos {
        width: 100%;
    }

    .infos {
        margin: 20px 0;
        padding: 10px;
    }

    .name {
        font-size: 16px;
        margin-bottom: 10px;
    }

    .color,
    .size {
        font-size: 14px;
    }

    .special {
        font-size: 12px;
    }

    .el-input-number {
        width: 70px;
        height: 25px
    }

    .stock {
        font-size: 14px;
    }

    .button {
        font-size: 14px
    }

    .dialog-info {
        margin-left: 10px;
    }

    .dialog-pic {
        width: 45%;
    }

    .arrow-right {
        right: 58%;
    }

    .dialog-name {
        font-size: 16px;
    }

    .dialog-size {
        height: 30px;
        font-size: 16px;
    }

    .dialog-color,
    .dialog-sizes {
        font-size: 14px;
        margin: 5px 0;
    }

    .size-container {
        margin: 10px 0 0
    }

    .dialog .color {
        width: 20px;
        height: 20px;
        border-radius: 20px;
    }

    .update {
        position: static;
        margin-top: 10px;
        font-size: 14px;
        height: 25px;
    }
}

@media screen and (max-width:414px) {
    .container {
        padding: 20px 10px
    }

    .title {
        font-size: 20px;
    }

    .right {
        padding-left: 5px
    }

    .left {
        max-width: 100px;
    }

    .mid {
        flex-wrap: wrap;
    }

    .dialog-size {
        margin: 0 5px 5px 0;
        width: 40px;
        font-size: 14px
    }

    .size-info {
        font-size: 12px;
    }
}
</style>
<style>
.dialog-container {
    background-color: black;
}

@media screen and (max-width:1024px) {
    .dialog-container {
        width: 75%;
    }
}

@media screen and (max-width:767px) {
    .dialog-container {
        width: 90%;
    }
}

@media screen and (max-width:414px) {
    .dialog-container {
        width: 95%;
        padding: 15px 3px;
    }
}
</style>
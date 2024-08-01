<template>
    <div class="container">
        <div class="title">您的願望清單</div>
        <div class="remind" v-show="!products.length" @click="toClothes('')">您的願望清單為空，點我馬上去選購</div>
        <div class="product" v-for="product in products" :key="product.name">
            <div class="info">
                <div class="pic">
                    <img :src="product.img">
                </div>
                <div class="detail">
                    <div class="name">{{ product.name }}</div>
                    <div class="details">
                        <div class="data">顏色 : {{ product.color }}</div>
                        <div class="data" v-show="product.confirmSize">尺碼 : {{ product.confirmSize }}</div>
                        <div class="price">價錢 :
                            <span :style="{ textDecoration: (product.sale) ? 'line-through' : 'none' }">
                                ${{ formattedPrice(product.price) }}</span><span v-if="product.sale">${{
                                    formattedPrice(product.price * 0.5) }}
                            </span>
                        </div>
                    </div>
                    <div class="stock">
                        <span v-if="showConfirmSizeStock(product) >= 5">尚有庫存</span>
                        <span class="less"
                            v-if="showConfirmSizeStock(product) < 5 && showConfirmSizeStock(product) > 0">較少庫存</span>
                        <span class="none" v-if="showConfirmSizeStock(product) == 0">庫存不足</span>
                    </div>
                    <div class="buttons">
                        <div class="button" @click="chooseSize(product)">選擇尺寸</div>
                        <div class="button" @click="addTOShoppingCart(product)">新增至購物車</div>
                    </div>
                </div>
                <div class="delete fa-regular fa-trash-can" @click="removeFavorite(product)"></div>
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
                        @click="changeColor(color)">
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
                <div class="size-stock" v-if="isChoose && chooseSizeStock >= 5">尚有庫存</div>
                <div class="size-stock less" v-if="isChoose && chooseSizeStock > 0 && chooseSizeStock < 5">較少庫存</div>
                <div class="size-stock empty" v-if="isChoose && chooseSizeStock === 0">庫存不足</div>
                <div class="dialog-price">
                    價錢 :
                    <span :style="{ textDecoration: (dialogSale) ? 'line-through' : 'none' }">
                        ${{ formattedPrice(dialogPrice) }}</span><span v-if="dialogSale">${{ formattedPrice(dialogPrice
                            * 0.5) }}
                    </span>
                </div>
                <div class="update" @click="updateInfo">更新</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteProductStore } from '@/stores/favoriteProduct';
import { useShoppingCartStore } from '@/stores/shoppingCart';
import { useCurrentGenderStore } from '@/stores/currentGender';
import { useProductsInfoStore } from '@/stores/productsInfo';
import { useProductFilterStore } from '@/stores/productFilter';
import { ElMessageBox, ElMessage } from 'element-plus';

const favoriteProductStore = useFavoriteProductStore()
const shoppingCartStore = useShoppingCartStore()
const productsInfoStore = useProductsInfoStore()

//商品列表
const products = ref<any>([])
onMounted(() => {
    products.value = favoriteProductStore.favoriteItems
});

watchEffect(() => {
    products.value = favoriteProductStore.favoriteItems
});

const availableColors = ref<string[]>([]);

//給金額的千位加上頓號
function formattedPrice(price: number) {
    return price.toLocaleString()
}

//商品詳細資訊
const dialogVisible = ref(false)
const dialogPic = ref("")
const dialogPic2 = ref("")
const dialogName = ref("")
const dialogColor = ref("")
const dialogSize = ref("")
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
const dialogPrice = ref()
const dialogSale = ref()
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
    availableColors.value = product.availableColors;
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
    dialogPrice.value = product.price
    dialogSale.value = product.sale
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
            return null;
    }
}

//是否顯示尺寸選項
function showSize(size: string) {
    dialogSize.value = size
    isChoose.value = true
}

//移除喜愛清單
function removeFavorite(product: any) {
    favoriteProductStore.toggleFavorite(product)
    updateLocalStorage(product)
    shoppingCartStore.loadFromLocalStorage()
}
// 更新localstorage中的favorite狀態
const updateLocalStorage = (product: any) => {
    let favoriteStatus = localStorage.getItem('favoriteStatus');
    let favoriteStatusObj = favoriteStatus ? JSON.parse(favoriteStatus) : {};
    favoriteStatusObj[product.id] = false;

    // 保存更新後的 favoriteStatus 回到 localStorage
    localStorage.setItem('favoriteStatus', JSON.stringify(favoriteStatusObj));
};
//關閉產品資訊頁面
function handleClose() {
    isChoose.value = false
    dialogVisible.value = false
    currentIndex.value = 0
    scrollImages()
}

//更新產品資訊
function updateInfo() {
    products.value = products.value.map((product: any) => {
        if (product.id === dialogID.value) {
            return { ...product, color: dialogColor.value, confirmSize: dialogSize.value };
        }
        return product;
    });
    favoriteProductStore.updateConfirmSize(dialogID.value, dialogSize.value);
    handleClose();
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
function changeColor(color: string) {
    const productStorage = ref()
    if (currentGenderStore.currentGender === "man") {
        productStorage.value = productsInfoStore.manProductList
    } else {
        productStorage.value = productsInfoStore.womanProductList
    }

    // 找到對應顏色的產品
    const newProduct = productStorage.value.find((product: any) => product.color === color && product.name === dialogName.value);

    if (newProduct) {
        // 找到當前的產品
        const currentProductIndex = products.value.findIndex((product: any) => product.name === dialogName.value && product.color === dialogColor.value);

        if (currentProductIndex !== -1) {
            products.value[currentProductIndex] = newProduct;
            dialogColor.value = color;
            chooseSize(newProduct);
        }
    }
}

//添加至購物車
function addTOShoppingCart(product: any) {
    if (product.confirmSize) {
        const calculatedPrice = product.sale ? product.price * 0.5 : product.price;

        const selectedProduct = {
            name: product.name,
            img: product.img,
            img2: product.img2,
            price: calculatedPrice,
            size: product.confirmSize,
            stock: showConfirmSizeStock(product),
            color: product.color,
            quantity: 1,
            sale: product.sale,
            id: product.id,
            availableColors: product.availableColors,
            favorite: product.favorite,
            type: product.type,
            category: product.category,
            sizeXS: product.sizeXS,
            sizeS: product.sizeS,
            sizeM: product.sizeM,
            sizeL: product.sizeL,
            sizeXL: product.sizeXL,
            size24: product.size24,
            size25: product.size25,
            size26: product.size26,
            size32A: product.size32A,
            size32B: product.size32B,
            size32C: product.size32C,
            size32D: product.size32D,
            size34A: product.size34A,
            size34B: product.size34B,
            size34C: product.size34C,
            size34D: product.size34D,
            size36A: product.size36A,
            size36B: product.size36B,
            size36C: product.size36C,
            size36D: product.size36D,
            onesize: product.onesize,
        };

        // 添加商品到购物车
        shoppingCartStore.addItem(selectedProduct);
        shoppingCartStore.openCart();

        // 清除和设置购物车关闭的超时
        shoppingCartStore.clearCloseCartTimeout();
        shoppingCartStore.closeCartTimeout = setTimeout(() => {
            shoppingCartStore.closeCart();
            shoppingCartStore.closeCartTimeout = null;
        }, 2000);

        // 从收藏中移除商品
        favoriteProductStore.toggleFavorite(product);
        updateLocalStorage(product)
        shoppingCartStore.loadFromLocalStorage()
    } else {
        // 提示用户选择尺寸
        ElMessageBox.confirm(
            `請先選擇商品尺寸`,
            'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        )
            .then(() => {
                chooseSize(product);
            })
            .catch(() => {
                ElMessage({
                    type: 'error',
                    message: '添加失敗',
                });
            });
    }
}

//路由
const router = useRouter()
const currentGenderStore = useCurrentGenderStore()
const productFilterStore = useProductFilterStore()
function toClothes(filter: string | string[]) {
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
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.title {
    font-size: 30px;
    font-weight: bold;
}

.remind {
    font-size: 25px;
    margin-top: 50px
}

.remind:hover {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
}

.product {
    width: 50%;
    margin: 15px;
    background-color: rgba(128, 128, 128, 0.5)
}

.info {
    display: flex;
    padding: 20px
}

.pic {
    width: 35%;
}

img {
    width: 100%;
}

.detail {
    width: 60%;
    padding-left: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.name,
.data,
.price,
.stock {
    margin-bottom: 10px;
    font-size: 18px;
}

.stock {
    margin-top: 10px;
    font-size: 16px;
}

.stock span {
    width: 80px;
    height: 20px;
    border: 2px solid green;
    padding: 3px;
    color: green;
    display: flex;
    justify-content: center;
    align-items: center;
}

.stock .less {
    border: 2px solid rgb(255, 100, 0);
    color: rgb(255, 100, 0);
}

.stock .none {
    border: 2px solid red;
    color: red;
}

.name {
    font-size: 20px;
    font-weight: bold;
}

.price span {
    margin-right: 10px
}

.delete {
    height: 20px;
}

.delete:hover {
    cursor: pointer;
}

.buttons {
    display: flex;
}

.button {
    color: white;
    background-color: black;
    padding: 5px;
    width: 100px;
    height: 20px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button:hover {
    cursor: pointer;
}


.dialog {
    display: flex;
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

.color {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-right: 15px;
    border: 1px solid white;
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

.size-stock {
    color: green;
    width: 100px;
    height: 30px;
    border: 2px solid green;
    display: flex;
    justify-content: center;
    align-items: center;
}

.size-stock.empty {
    color: red;
    border: 2px solid red
}

.size-stock.less {
    color: rgb(255, 100, 0);
    border: 2px solid rgb(255, 100, 0)
}

.dialog-price {
    font-size: 20px;
    margin: 20px 0;
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
}

.update:hover {
    cursor: pointer;
    background-color: rgb(180, 180, 180)
}

@media screen and (max-width:1024px) {
    .product {
        width: 80%
    }
}

@media screen and (max-width:767px) {
    .container{
        padding: 10px
    }
    .product {
        width: 100%;
    }
    .remind{
        font-size: 20px;
    }
    .dialog-pic{
        width: 45%;
    }
    .dialog-info{
        margin-left: 15px
    }
    .arrow-right {
        right: 60%;  
    }
    .name,
    .data,
    .price,
    .stock {
        font-size: 16px;
    }
    .stock{
        margin-top: 5px
    }
    .buttons{
        flex-wrap: wrap
    }
    .button {
        font-size: 14px;
        margin-bottom: 5px;
    }
    .dialog-name{
        font-size: 16px;
    }
    .dialog-color,.dialog-sizes,.dialog-price {
        font-size: 14px;
        margin: 5px 0;
    }
    .color{
        width: 20px;
        height: 20px;
        border-radius: 20px;
    }
    .dialog-size {
        height: 30px;
        font-size: 16px;
        margin-bottom: 5px
    }
    .update {
        margin-top: 15px;
        font-size: 14px;
        height: 25px;
    }
    .size-info{
        font-size: 12px
    }

}
@media screen and (max-width:414px){
    .container{
        padding: 10px 5px;
    }
    .info{
        padding: 10px 5px 
    }
    .detail{
        padding-left: 5px;
    }
    .pic{
        width: 40%;
    }
    .name,.data,.price,.stock {
        margin-bottom: 5px;
    }
    .dialog-size,.size-stock{
        height: 25px;
    }
   
}
</style>
<style>
.dialog-container {
    background-color: black
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
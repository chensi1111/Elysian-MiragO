<template>
  <div class="poster">
    <div class="info">活動限定</div>
    <div class="info sale">低至5折</div>
    <div class="info small" @click="toSaleClothes('')">立即選購</div>
  </div>
  <div class="title">活動限定款市:低至5折</div>
  <div class="products-container">
    <div class="scroll-button left" @click="scrollLeft" v-show="showLeftButton">
      <CaretLeft />
    </div>
    <div class="products" ref="productsRef">
      <div class="product" v-for="(product, index) in products" :key="index" @click="toProductInfo(product)">
        <div class="product-container" :style="{ backgroundImage: `url(${product.img})` }"
        @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
          <i :class="['fa-heart', product.favorite ? 'fa-solid' : 'fa-regular']"
            @click="toggleFavorite($event, product)"></i>
          <div class="special">活動限定</div>
          <div class="cover">
            <div class="choose">選擇您的尺碼</div>
            <div class="sizes">
              <div class="size" v-if="product.sizeXS !== undefined"
                @click="selectSize($event, product, 'XS', product.sizeXS)">XS</div>
              <div class="size" v-if="product.sizeS !== undefined"
                @click="selectSize($event, product, 'S', product.sizeS)">S</div>
              <div class="size" v-if="product.sizeM !== undefined"
                @click="selectSize($event, product, 'M', product.sizeM)">M</div>
              <div class="size" v-if="product.sizeL !== undefined"
                @click="selectSize($event, product, 'L', product.sizeL)">L</div>
              <div class="size" v-if="product.sizeXL !== undefined"
                @click="selectSize($event, product, 'XL', product.sizeXL)">XL</div>
            </div>
          </div>
        </div>
        <div class="product-infos">
          <div class="product-info">{{ product.name }}</div>
          <div class="price">
            <div class="product-info discount">TWD{{ formattedPrice(product.price * 0.5) }}</div>
            <div class="product-info normal">TWD{{ formattedPrice(product.price) }}</div>
          </div>
          <div class="product-info more-discount">3件8折</div>
        </div>
      </div>
    </div>
    <div class="scroll-button right" @click="scrollRight" v-show="showRightButton">
      <CaretRight />
    </div>
    <div class="more" @click="toSaleClothes('')">更多優惠款式</div>
  </div>
  <div class="styles">
    <div class="style" v-for="(item, index) in items" :key="index" :style="{ backgroundImage: `url(${item.image})` }">
      <div class="topic">{{ item.topic }}</div>
      <div class="options">
        <div class="option" @click="toClothes(item.type1)">{{ item.option1 }}</div>
        <div class="option" @click="toClothes(item.type2)">{{ item.option2 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, watch, nextTick, watchEffect } from "vue";
import { useShoppingCartStore } from '@/stores/shoppingCart';
import { useFavoriteProductStore } from '@/stores/favoriteProduct'
import { useProductsInfoStore } from "@/stores/productsInfo";
import { useProductFilterStore } from "@/stores/productFilter";
import accessoryPic from "@/assets/woman/accessory.jpg"
import fitnessPic from "@/assets/woman/fitness.jpg"
import normalPic from "@/assets/woman/normal.jpg"
import underwearPic from "@/assets/woman/underwear.jpg"
import { useRouter } from "vue-router";


//分類櫥窗資料
const items = reactive([
  { topic: "夏日衣櫥", image: normalPic, option1: "選購T恤", option2: "選購牛仔褲", type1: "t-shirt", type2: "jeans" },
  { topic: "內衣首選", image: underwearPic, option1: "選購內衣", option2: "選購內褲", type1: "bra", type2: "panties" },
  { topic: "運動穿搭", image: fitnessPic, option1: "選購運動內衣", option2: "選購緊身褲", type1: "sport-bra", type2: "legging" },
  { topic: "時尚配件", image: accessoryPic, option1: "選購包款", option2: "選購帽款", type1: "bag", type2: "hat" },
]);

// pinia數據
const favoriteProductStore = useFavoriteProductStore()
const productsInfoStore = useProductsInfoStore()

// 產品列表
const products = ref<any[]>([]);
const originalProducts = ref<any[]>([])

watchEffect(() => {
  originalProducts.value = productsInfoStore.womanProductList.map(product => ({
    ...product,
    favorite: favoriteProductStore.favoriteItems.some(favItem => favItem.id === product.id),
  }));
  products.value = originalProducts.value.filter(product => product.sale).slice(0, 10);
});

//給金額的千位加上頓號
function formattedPrice(price: number) {
  return price.toLocaleString()
}

//添加至購物車
const shoppingCartStore = useShoppingCartStore()
const selectSize = (event: Event, product: any, size: string, stock: number) => {
  event.stopPropagation();
  const selectedProduct = {
    name: product.name,
    img: product.img,
    img2: product.img2,
    price: product.price * 0.5,
    size: size,
    stock: stock,
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

  shoppingCartStore.addItem(selectedProduct);
  shoppingCartStore.openCart();

  shoppingCartStore.clearCloseCartTimeout();
  shoppingCartStore.closeCartTimeout = setTimeout(() => {
    shoppingCartStore.closeCart();
    shoppingCartStore.closeCartTimeout = null;
  }, 2000);
};

// 切換收藏狀態
function toggleFavorite(event: Event, product: any) {
  event.stopPropagation();
  product.favorite = !product.favorite
  favoriteProductStore.toggleFavorite(product)
  updateLocalStorage()
  shoppingCartStore.loadFromLocalStorage()
}

// 更新localstorage中的favorite狀態
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

// 讀取localstorage中的favorite狀態
const loadFavoriteStatus = () => {
  const storedFavoriteStatus = localStorage.getItem('favoriteStatus');
  if (storedFavoriteStatus) {
    const favoriteStatus = JSON.parse(storedFavoriteStatus);
    products.value.forEach((product: any) => {
      product.favorite = favoriteStatus[product.id];
    });
  }
};

//版面
//計算商品的寬度
const productsRef = ref<HTMLElement | null>(null);
const productWidth = ref(0);

const getProductWidth = () => {
  nextTick(() => {
    if (productsRef.value) {
      const productElement = productsRef.value.querySelector(".product") as HTMLElement;
      if (productElement) {
        //用來返回元素的寬度
        const rect = productElement.getBoundingClientRect();
        productWidth.value = rect.width;
      }
    }
  });
};

// 更新左右按鈕的顯示狀態
const showLeftButton = ref(true);
const showRightButton = ref(true);
const scrollCount = ref(0);
const productNumber = ref(6);
const maxScrollCount = ref(0);

//更新按鈕最大點擊次數
function updateMaxScrollCount() {
  maxScrollCount.value = products.value.length - productNumber.value
}

//更新按鈕的顯示隱藏
function updateButtonVisibility() {
  showLeftButton.value = scrollCount.value > 0;
  showRightButton.value = scrollCount.value < maxScrollCount.value;
}

//按鈕滾動及滾動時禁用按鈕
let isScrolling = false;
const productMargin = ref(20)

function changeMarginAndCount() {
  if (window.innerWidth <= 1200 && window.innerWidth > 1024) {
    productMargin.value = 10
    productNumber.value = 5
  }
  if (window.innerWidth <= 1024 && window.innerWidth > 767) {
    productMargin.value = 10
    productNumber.value = 4
  }
  if (window.innerWidth <= 767 && window.innerWidth > 600) {
    productMargin.value = 10
    productNumber.value = 3
  }
  if (window.innerWidth <= 600 && window.innerWidth >= 414) {
    productMargin.value = 10
    productNumber.value = 2
  }
  if (window.innerWidth < 414) {
    productMargin.value = 8
    productNumber.value = 2
  }
  updateMaxScrollCount()
}

const scrollLeft = () => {
  if (productsRef.value && !isScrolling) {
    isScrolling = true;
    setButtonState(false);
    if (scrollCount.value > 0) {
      scrollCount.value--;
      productsRef.value.scrollBy({
        left: -(productWidth.value + productMargin.value),
        behavior: "smooth",
      });
    }

    setTimeout(() => {
      isScrolling = false;
      setButtonState(true);
    }, 300);
  }
};

const scrollRight = () => {
  if (productsRef.value && !isScrolling) {
    isScrolling = true;
    setButtonState(false);
    if (scrollCount.value < maxScrollCount.value) {
      scrollCount.value++;
      productsRef.value.scrollBy({
        left: productWidth.value + productMargin.value,
        behavior: "smooth",
      });
    }

    setTimeout(() => {
      isScrolling = false;
      setButtonState(true);
    }, 300);
  }
};

//手機觸控
let startX = 0;
let startY = 0;
let isMoving = false;

//觸碰的點
const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  isMoving = true;
};

//判斷往左往右
const handleTouchMove = (event: TouchEvent) => {
  if (!isMoving) return;
  const touch = event.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 30) {
      scrollLeft();
      isMoving = false;
    } else if (deltaX < -30) {
      scrollRight();
      isMoving = false;
    }
  }
};

//觸控結束重置
const handleTouchEnd = () => {
  isMoving = false;
};


// 啟用及禁用按鈕
const setButtonState = (state: boolean) => {
  const leftButton = document.querySelector(".scroll-button.left") as HTMLButtonElement;
  const rightButton = document.querySelector(".scroll-button.right") as HTMLButtonElement;
  if (leftButton && rightButton) {
    leftButton.disabled = !state;
    rightButton.disabled = !state;
  }
};

//監聽滾動次數
watch(scrollCount, () => {
  updateButtonVisibility();
})

//初始化及監聽視窗大小變化，重新計算商品寬度
onMounted(async () => {
  await nextTick();
  getProductWidth();
  updateMaxScrollCount();
  changeMarginAndCount();
  window.addEventListener("resize", getProductWidth);
  window.addEventListener("resize", changeMarginAndCount);
  updateButtonVisibility();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getProductWidth);
  window.addEventListener("resize", changeMarginAndCount);
});

//當產品列表渲染完執行
watch(products, async () => {
  await nextTick();
  getProductWidth();
  updateMaxScrollCount();
  updateButtonVisibility();
  loadFavoriteStatus()
});




//路由
const router = useRouter()
const productFilterStore = useProductFilterStore()

//一般商品
function toClothes(filter: string | string[]) {
  productFilterStore.isSale = false
  router.push({
    path: "/woman/clothes",
  }).then(() => {
    productFilterStore.typeFilter = filter
  })

}

//特價商品
function toSaleClothes(filter: string | string[]) {
  productFilterStore.isSale = true
  router.push({
    path: "/woman/clothes",
  }).then(() => {
    productFilterStore.typeFilter = filter
  })
}

//商品資訊頁
function toProductInfo(product: any) {
  router.push({
    path: '/product',
    query: product
  })
}
</script>

<style scoped>
.poster {
  height: 80vh;
  background-image: url(@/assets/woman_poster.jpg);
  background-size: cover;
  background-position: top;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.info {
  color: white;
  font-size: 30px;
  font-weight: bold;
  margin-top: 10px;
  text-shadow: 1px 1px black;
}

.info.sale {
  font-size: 70px;
}

.info.small {
  font-size: 25px;
  padding-bottom: 5px;
  border-bottom: 2px solid gray;
}

.info.small:hover {
  cursor: pointer;
  border-bottom: 2px solid white;
}

.title {
  font-size: 25px;
  margin: 20px 0 20px 20px;
}

.products-container {
  position: relative;
}

.scroll-button {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50%;
  transform: translateY(-100px);
  color: black;
  border: none;
  cursor: pointer;
  z-index: 1;
}

.scroll-button.left {
  left: 10px;
}

.scroll-button.right {
  right: 10px;
}

.products {
  display: flex;
  overflow: hidden;
  width: calc(100vw - 100px);
  margin: 0 auto;
}

.product {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: calc((100% / 6) - 20px);
  height: 400px;
  margin: 10px;

}

.product:hover {
  cursor: pointer;
}

.product i {
  position: absolute;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: white;

}

.product-container {
  height: 300px;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center
}

.product-infos {
  height: 100px;
}

.product-info {
  margin: 5px;
  font-size: 14px;
  font-weight: bold
}

.product-info.normal {
  color: gray;
  text-decoration: line-through;
}

.product-info.more-discount {
  color: red;
  font-size: 12px;
}

.price {
  display: flex;
}

.cover {
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: -100px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.special {
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 12px;
  width: 50px;
  height: 20px;
  padding: 3px;
  color: white;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
}

.choose {
  font-size: 16px;
}

.sizes {
  display: flex;
}

.size {
  font-size: 14px;
  font-weight: bold;
  margin: 10px;
}

.size:hover {
  color: blue;
  border-bottom: 1px solid blue;
}

.product:hover .cover {
  transition: 0.5s;
  bottom: 0
}

.more {
  margin: 30px auto;
  font-size: 20px;
  width: 150px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 3px;
}

.more:hover {
  cursor: pointer;
  background-color: black;
  color: white;
}

.styles {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.style {
  width: calc(50% - 10px);
  height: 800px;
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.style:nth-child(even) {
  margin-right: 0;
}

.topic {
  font-size: 30px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px black;
  margin: 0 0 20px 50px;
}

.options {
  display: flex;
  margin: 0 0 50px 50px;
}

.option {
  font-size: 20px;
  margin-right: 20px;
  color: white;
  padding-bottom: 3px;
  text-shadow: 1px 1px black;
  border-bottom: 1px solid gray;
}

.option:hover {
  cursor: pointer;
  border-bottom: 1px solid white;
}

@media screen and (max-width:1200px) {
  .product {
    flex-basis: calc((100% / 5) - 10px);
    margin: 5px;
  }
}

@media screen and (max-width:1024px) {
  .poster {
    height: 50vh;
  }

  .style {
    height: 500px;
  }

  .more {
    margin: 20px auto;
  }

  .topic {
    margin: 0 0 20px 20px;
  }

  .options {
    margin: 0 0 20px 20px;
  }

  .products {
    width: calc(100vw - 50px);
  }

  .product {
    flex-basis: calc((100% / 4) - 10px);
  }
}

@media screen and (max-width:767px) {
  .info {
    font-size: 25px;
  }

  .info.sale {
    font-size: 50px;
  }

  .info.small {
    font-size: 20px;
  }

  .title {
    font-size: 20px;
  }

  .products {
    width: calc(100vw - 25px);
  }

  .product {
    flex-basis: calc((100% / 3) - 10px);
  }

  .special {
    height: 15px;
  }

  .more {
    font-size: 16px;
    width: 120px;
  }

  .styles {
    flex-wrap: nowrap;
    flex-direction: column;
  }

  .style {
    width: 100%;
    height: 400px;
  }

  .topic {
    font-size: 25px;
  }

  .option {
    font-size: 18px;
  }
}

@media screen and (max-width:600px) {
  .product {
    flex-basis: calc((100% / 2) - 10px);
  }
}

@media screen and (max-width:414px) {
  .poster {
    height: 30vh;
  }

  .info.sale {
    font-size: 40px;
  }

  .product {
    margin: 5px 4px;
    height: 350px
  }

  .product-container {
    height: 250px;
  }

  .special {
    font-size: 10px;
    width: 40px;
  }

  .product i {
    width: 25px;
    height: 25px;
    border-radius: 25px;
  }

  .product-infos {
    height: 50px;
  }

  .product-info.normal,
  .product-info.discount {
    font-size: 12px
  }
}
</style>
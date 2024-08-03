<template>
    <div class="container">
        <div class="title">{{titleName}}</div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/man' }">男士</el-breadcrumb-item>
            <el-breadcrumb-item v-if="!isSaleProducts">{{titleName}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="isSaleProducts">特價</el-breadcrumb-item>
            <el-breadcrumb-item v-if="selectedTypeName">{{ selectedTypeName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="navs" v-if="windowWidth >= 767">
            <div class="nav" v-for="(item, index) in items" :key="index"
                :style="{ backgroundImage: `url(${item.image})` }" @click="productFilter(item.type)">
                <div class="name">{{ item.title }}</div>
            </div>
        </div>
        <div ref="filterContainer" class="filter-container" :class="{ 'is-fixed': isFixed }">
            <div class="filter " @click="showFilter" v-show="!productFilterStore.filterOpen">篩選及排序<i class="fa-solid fa-sliders"></i></div>
            <div class="filter " @click="showFilter" v-show="productFilterStore.filterOpen">關閉篩選器<i class="fa-solid fa-sliders"></i></div>
            <div class="filter-types">
                <div class="filter-type" @click="removeType" v-show="selectedTypeName">{{ selectedTypeName }}
                    <i class="fa-solid fa-x"></i>
                </div>
                <div class="filter-type" v-show="selectedIntervalDisplay" @click="removeInterval">
                    {{ selectedIntervalDisplay }}
                    <i class="fa-solid fa-x"></i>
                </div>
                <div class="filter-type" v-for="color in selectedColor" :key="color" v-show="selectedColor.length"
                    @click="removeColor(color)">
                    {{ getColorName(color) }}
                    <i class="fa-solid fa-x"></i>
                </div>
                <div class="filter-type" v-for="size in selectedSize" :key="size" @click="removeSize(size)">
                    {{ size }}
                    <i class="fa-solid fa-x"></i>
                </div>
                <div class="filter-type" @click="removeSale()" v-show="productFilterStore.isSale">
                    特價
                    <i class="fa-solid fa-x"></i>
                </div>
                <div class="filter-type" v-show="selectedKeyword" @click="removeKeyword()">
                    {{ selectedKeyword }}
                    <i class="fa-solid fa-x"></i>
                </div>
            </div>
            <div class="right">
                <div class="product-number">{{ filteredProducts.length }} / {{ filteredProductsFull.length }} 件商品</div>
                <div class="arrays">
                    <div class="array" @click="columns = 1" v-if="windowWidth <= 767">
                        <div class="spot"></div>
                    </div>
                    <div class="array" @click="columns = 2">
                        <div class="spot"></div>
                        <div class="spot"></div>
                    </div>
                    <div class="array" @click="columns = 3" v-if="windowWidth > 767">
                        <div class="spot"></div>
                        <div class="spot"></div>
                        <div class="spot"></div>
                    </div>
                    <div class="array" @click="columns = 4" v-if="windowWidth > 767">
                        <div class="spot"></div>
                        <div class="spot"></div>
                        <div class="spot"></div>
                        <div class="spot"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <TheFilter v-show="productFilterStore.filterOpen" :class="{ 'filterFixed': isFixed }"></TheFilter>
            <div class="products">
                <div class="product" v-for="(product, index) in filteredProducts" :key="index"
                    :style="{ width: productWidth, height: productHeight }" @click="toProductInfo(product)">
                    <div class="product-container"
                        :style="{ backgroundImage: `url(${product.img})`, height: productContainerHeight }"
                        @mouseover="changeImage(product, true)" @mouseleave="changeImage(product, false)">
                        <i :class="['fa-heart', product.favorite ? 'fa-solid' : 'fa-regular']"
                            @click="toggleFavorite($event, product)"></i>
                        <div class="special" v-if="product.sale">活動限定</div>
                        <div class="cover" v-if="windowWidth >= 767">
                            <div class="choose">選擇您的尺碼</div>
                            <div class="sizes">
                                <div class="size" v-for="sizeOption in filteredSizes(product)" :key="sizeOption.label"
                                    @click="selectSize($event, product, sizeOption.label, product[sizeOption.key])">
                                    {{ sizeOption.label }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="product-infos">
                        <div class="product-name">{{ product.name }}</div>
                        <div class="prices">
                            <div class="price" :style="{ textDecoration: product.sale ? 'line-through' : 'none' }">TWD{{
                                formattedPrice(product.price) }}</div>
                            <div class="price" v-if="product.sale">TWD{{ formattedPrice(product.price * 0.5) }}</div>
                        </div>
                        <div class="discount">3件8折</div>
                        <div class="more" v-if="product.availableColors.length > 1">更多顏色可選</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="load" @click="loadMore" v-if="!(filteredProducts.length == filteredProductsFull.length)">顯示更多</div>
    </div>

</template>
<script setup lang="ts">
import { ref, watchEffect, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsInfoStore } from '@/stores/productsInfo';
import { useFavoriteProductStore } from '@/stores/favoriteProduct';
import { useShoppingCartStore } from '@/stores/shoppingCart';
import { useProductFilterStore } from '@/stores/productFilter';
import TheFilter from '@/components/TheFilter.vue';
import TshirtPic from '@/assets/man/T-shirt.jpg'
import jacketPic from '@/assets/man/jacket.jpg'
import jeansPic from '@/assets/man/jeans.jpg'
import pantsPic from '@/assets/man/pants.jpg'
import sportPic from '@/assets/man/sport.jpg'
import shirtPic from '@/assets/man/shirt.jpg'

//標題名稱
const titleName = computed(() => {
  if (productFilterStore.typeFilter === 'sport' ||
      productFilterStore.typeFilter === 'gym-suit' ||
      productFilterStore.typeFilter === 'sport-suit' ||
      productFilterStore.typeFilter === 'sport-pant') {
    return '運動休閒';
  }
  if (productFilterStore.typeFilter === 'underwear' ||
      productFilterStore.typeFilter === 'boxers' ||
      productFilterStore.typeFilter === 'boxer-briefs' ||
      productFilterStore.typeFilter === 'briefs') {
    return '內衣';
  }
  if (productFilterStore.typeFilter === 'accessory' ||
      productFilterStore.typeFilter === 'shoe' ||
      productFilterStore.typeFilter === 'hat' ||
      productFilterStore.typeFilter === 'bag' ||
      productFilterStore.typeFilter === 'wallet' ||
      productFilterStore.typeFilter === 'belt') {
    return '配件';
  }
  return '所有商品';
});

//導覽篩選選項
const items = ref<any[]>([
    { title: "T恤 & Polo衫", image: TshirtPic, type: "suit" },
    { title: "襯衫", image: shirtPic, type: "shirt" },
    { title: "運動衫", image: sportPic, type: "sport-suit" },
    { title: "大衣 & 外套", image: jacketPic, type: "coat" },
    { title: "牛仔褲", image: jeansPic, type: "jeans" },
    { title: "長褲 & 短褲", image: pantsPic, type: "pant" },
])

const productsInfoStore = useProductsInfoStore()
const favoriteProductStore = useFavoriteProductStore()
const productFilterStore = useProductFilterStore()
const products = ref<any[]>([])
const saleProducts = ref<any[]>([])
const isSaleProducts = ref()

//獲取產品資訊
watchEffect(() => {
    products.value = productsInfoStore.manProductList.map(product => ({
        ...product,
        favorite: favoriteProductStore.favoriteItems.some(favItem => favItem.id === product.id),
    }));
    saleProducts.value = products.value.filter(product => product.sale);
    isSaleProducts.value = productFilterStore.isSale
});

// 當前選擇的產品類型
const selectedType = ref<string | null>(null);
const selectedSort = ref()
const selectedInterval = ref()
const selectedColor = ref()
const selectedSize = ref()
const selectedKeyword = ref()


watchEffect(() => {
    selectedType.value = productFilterStore.typeFilter
    selectedSort.value = productFilterStore.sortFilter
    selectedInterval.value = productFilterStore.intervalFilter
    selectedColor.value = productFilterStore.colorFilter
    selectedSize.value = productFilterStore.sizeFilter
    selectedKeyword.value = productFilterStore.keywordFilter
    localStorage.setItem('filterState', JSON.stringify({
        typeFilter: productFilterStore.typeFilter,
        sortFilter: productFilterStore.sortFilter,
        intervalFilter: productFilterStore.intervalFilter,
        colorFilter: productFilterStore.colorFilter,
        sizeFilter: productFilterStore.sizeFilter,
        keywordFilter: productFilterStore.keywordFilter,
    }));
})

// 篩選產品
function productFilter(type: string) {
    productFilterStore.typeFilter = type;
    productFilterStore.resetLoad()
}
//篩選的類型名
const selectedTypeName = computed(() => {
    switch (selectedType.value) {
        case 'suit':
            return "T恤 & Polo衫";
        case 'shirt':
            return "襯衫";
        case 'sport-suit':
            return "運動衫";
        case 'coat':
            return "大衣 & 外套";
        case 'jeans':
            return "牛仔褲";
        case 'pant':
            return "長褲 & 短褲";
        case 'sport':
            return "運動休閒"
        case 'gym-suit':
            return "運動T恤 & 背心"
        case 'sport-pant':
            return "運動褲"
        case 'underwear':
            return "內衣"
        case 'boxers':
            return "平口褲"
        case 'briefs':
            return "三角褲"
        case 'boxer-briefs':
            return "四角褲"
        case 'accessory':
            return "配件"
        case 'hat':
            return "帽子"
        case 'bag':
            return "包款"
        case 'wallet':
            return "皮夾"
        case 'belt':
            return "皮帶"
        case 'shoe':
            return "鞋子"
        case 'sale':
            return "特價"
        default:
            return "";
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

const sizes = [
    { label: 'XS', key: 'sizeXS' },
    { label: 'S', key: 'sizeS' },
    { label: 'M', key: 'sizeM' },
    { label: 'L', key: 'sizeL' },
    { label: 'XL', key: 'sizeXL' },
    { label: 'onesize', key: 'onesize' },
    { label: '24', key: 'size24' },
    { label: '25', key: 'size25' },
    { label: '26', key: 'size26' },
];

const filteredSizes = (product: any) => {
    return sizes.filter(sizeOption => product[sizeOption.key] !== undefined);
};
const selectedIntervalDisplay = computed((): string => {
    if (selectedInterval.value && selectedInterval.value.length === 2) {
        const [minPrice, maxPrice] = selectedInterval.value;

        if (minPrice === 0 && maxPrice === 10000) {
            return '';
        }

        return `${minPrice} TWD - ${maxPrice} TWD`;
    }
    return '';
});

// 篩選後的商品
const filteredProductsFull = computed(() => {
    let result = products.value;
    if (isSaleProducts.value == true) {
        result = saleProducts.value
    }

    //篩選關鍵字
    if (selectedKeyword.value) {
        result = result.filter(product => {
            return product.name.toLowerCase().includes(selectedKeyword.value.toLowerCase());
        });
    }

    // 篩選類型
    if (selectedType.value) {
        result = result.filter(product => {
            // 如果 product.type 不存在，跳過該產品
            if (!product.type) return false;
            return product.type.includes(selectedType.value);
        });
    }

    // 篩選價格區間
    if (selectedInterval.value && selectedInterval.value.length === 2) {
        const [minPrice, maxPrice] = selectedInterval.value;
        result = result.filter(product => {
            if (product.sale) {
                return product.price * 0.5 >= minPrice && product.price * 0.5 <= maxPrice;
            } else {
                return product.price >= minPrice && product.price <= maxPrice;
            }
        });
    }

    // 篩選顏色
    if (selectedColor.value && selectedColor.value.length > 0) {
        result = result.filter(product => selectedColor.value.includes(product.color));
    }

    // 篩選尺寸
    if (selectedSize.value && selectedSize.value.length > 0) {
        result = result.filter(product => {
            return selectedSize.value.some((size: String) => {
                switch (size) {
                    case 'XS':
                        return product.sizeXS !== undefined;
                    case 'S':
                        return product.sizeS !== undefined;
                    case 'M':
                        return product.sizeM !== undefined;
                    case 'L':
                        return product.sizeL !== undefined;
                    case 'XL':
                        return product.sizeXL !== undefined;
                    case '24':
                        return product.size24 !== undefined;
                    case '25':
                        return product.size25 !== undefined;
                    case '26':
                        return product.size26 !== undefined;
                    case 'onesize':
                        return product.onesize !== undefined;
                    default:
                        return false;
                }
            });
        });
    }

    // 排序
    if (selectedSort.value) {
        result.sort((a, b) => {
            const priceA = a.sale ? a.price / 2 : a.price;
            const priceB = b.sale ? b.price / 2 : b.price;

            if (selectedSort.value === 'original') {
                if (a.sale && !b.sale) {
                    return -1; // a 在 b 前
                }
                if (!a.sale && b.sale) {
                    return 1; // b 在 a 前
                }
            }
            if (selectedSort.value === 'high') {
                return priceB - priceA; // 高價優先
            } else if (selectedSort.value === 'low') {
                return priceA - priceB; // 低價優先
            }
            return 0;
        });
    }

    return result;
});

//篩選顯示數量
const filteredProducts = computed(() => {
    return filteredProductsFull.value.slice(0, productFilterStore.itemsToShow)
})

//移除標籤
function removeType() {
    productFilterStore.typeFilter = undefined
    productFilterStore.filterScrollToTop()
}
function removeInterval() {
    selectedInterval.value.splice(0, 2, 0, 10000);
    productFilterStore.filterScrollToTop()
}
function removeColor(color: string) {
    const index = selectedColor.value.indexOf(color);
    if (index !== -1) {
        selectedColor.value.splice(index, 1);
    }
    productFilterStore.filterScrollToTop()
}
function removeSize(size: string) {
    const index = selectedSize.value.indexOf(size);
    if (index !== -1) {
        selectedSize.value.splice(index, 1);
    }
    productFilterStore.filterScrollToTop()
}
function removeSale() {
    productFilterStore.isSale = false
    productFilterStore.filterScrollToTop()
}
function removeKeyword() {
    productFilterStore.keywordFilter = undefined
    productFilterStore.filterScrollToTop()
}
const columns = ref(4);
function changeColumns() {
    if (windowWidth.value > 767) {
        columns.value = 4
    } else {
        columns.value = 2
    }
}

// 計算每個商品的寬高
const productWidth = computed(() => {
    const gap = 20;
    return `calc((100% - ${gap * (columns.value - 1)}px) / ${columns.value})`;
});

//視窗大小
const windowWidth = ref(window.innerWidth);
function updateWindowWidth() {
    windowWidth.value = window.innerWidth;
}

onMounted(() => {
    changeColumns()
    window.addEventListener('resize', updateWindowWidth);
    window.addEventListener('resize', changeColumns);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWindowWidth);
    window.removeEventListener('resize', changeColumns);
});

//商品高度數值
const productHeightNumber = computed(() => {
    if (windowWidth.value >= 1024) {
        return 450
    } else if (windowWidth.value >= 767 && windowWidth.value < 1024) {
        return 400
    } else if (windowWidth.value < 767 && windowWidth.value > 414) {
        return 200
    } else if (windowWidth.value <= 414) {
        return 50
    } else {
        return 450
    }

})
//商品高度選項
const productHeight = computed(() => {
    switch (columns.value) {
        case 4:
            return `${productHeightNumber.value}px`;
        case 3:
            return `${productHeightNumber.value + 100}px`;
        case 2:
            return `${productHeightNumber.value + 250}px`;
        case 1:
            return `${productHeightNumber.value + 300}px`;
        default:
            return `${productHeightNumber.value}px`;
    }
});
const productContainerHeight = computed(() => {
    switch (columns.value) {
        case 4:
            return `${productHeightNumber.value - 100}px`;
        case 3:
            return `${productHeightNumber.value}px`;
        case 2:
            return `${productHeightNumber.value + 150}px`;
        case 1:
            return `${productHeightNumber.value + 200}px`;
        default:
            return `${productHeightNumber.value}px`;
    }
})

//篩選器位置
const isFixed = ref(false);
const filterContainer = ref<HTMLElement | null>(null);

const handleScroll = () => {
    if (filterContainer.value) {
        const offsetTop = filterContainer.value.getBoundingClientRect().top;
        if (windowWidth.value > 1024) {
            if (window.scrollY - 300 > offsetTop) {
                isFixed.value = true;
            } else {
                isFixed.value = false;
            }
        } else if (windowWidth.value>=767 && windowWidth.value <= 1024) {
            if (window.scrollY - 200 > offsetTop) {
                isFixed.value = true;
            } else {
                isFixed.value = false;
            }
        } else {
            if (window.scrollY  + 100> offsetTop) {
                isFixed.value = true;
            } else {
                isFixed.value = false;
            }
        }

    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

//給金額的千位加上頓號
function formattedPrice(price: number) {
    return price.toLocaleString()
}

//切換顯示照片
function changeImage(product: any, isHover: boolean) {
    if (isHover) {
        if (!product.isHovered) {
            product.originalImg = product.img;
            product.img = product.img2;
            product.isHovered = true;
        }
    } else {
        if (product.isHovered) {
            product.img = product.originalImg;
            product.isHovered = false;
        }
    }
}

//添加至購物車
const shoppingCartStore = useShoppingCartStore()
const selectSize = (event: Event, product: any, size: string, stock: number) => {
    event.stopPropagation();
    const calculatedPrice = product.sale ? product.price * 0.5 : product.price;
    const selectedProduct = {
      ...product, 
      img: product.originalImg, 
      price: calculatedPrice, 
      size, 
      stock, 
      quantity: 1 
    };

    shoppingCartStore.addItem(selectedProduct);
    shoppingCartStore.openCart();

    shoppingCartStore.clearCloseCartTimeout();
    shoppingCartStore.closeCartTimeout = setTimeout(() => {
        shoppingCartStore.closeCart();
        shoppingCartStore.closeCartTimeout = null;
    }, 2000);
};

//切換喜愛狀態
function toggleFavorite(event: Event, product: any) {
    event.stopPropagation();
    if (product.isHovered) {
        product.img = product.originalImg
    }

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
}
onMounted(() => {
    loadFavoriteStatus()
})
watch(products, async () => {
    await nextTick();
    updateLocalStorage()
    loadFavoriteStatus()
});

//顯示篩選器
function showFilter() {
    productFilterStore.filterOpen=!productFilterStore.filterOpen;
    if(windowWidth.value<767){
        window.scrollTo(0, 0);
    }
}

//顯示更多商品
function loadMore() {
    productFilterStore.loadMoreProducts()
}

//路由
const router = useRouter()
function toProductInfo(product: any) {
    router.push({
        path: '/product',
        query: product
    })
}
</script>

<style scoped>
.container {
    padding: 0 20px;
    margin: 0 auto;
}

.title {
    font-size: 30px;
    font-weight: bold;
    margin: 40px 0;
    text-align: center;
}

.navs {
    display: flex;
    margin: 30px 0
}

.nav {
    flex: 1;
    height: 300px;
    background: gray;
    margin-right: 20px;
    box-sizing: border-box;
    position: relative;
    background-size: cover;
    background-position: center
}

.nav:hover {
    cursor: pointer;
}

.nav:last-child {
    margin-right: 0;
}

.name {
    color: white;
    font-weight: bold;
    font-size: 20px;
    position: absolute;
    bottom: 10px;
    left: 10px;
}

.filter-container {
    display: flex;
    padding: 20px 0;
    justify-content: space-between;
    align-items: center;
    background-color: white;
}

.filter-container.is-fixed {
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    top: 150px;
    z-index: 90;
}

.filter-types {
    display: flex;
    flex-wrap: wrap;
}

.filter-type {
    background-color: rgb(220, 220, 220);
    padding: 5px 10px;
    font-weight: bold;
    margin: 0 10px 5px 0;
}

.filter-type:hover {
    cursor: pointer;
    background-color: rgb(180, 180, 180)
}

.filter-type i {
    margin-left: 10px;
    font-size: 12px;
}

.filter {
    width: 180px;
    height: 40px;
    background-color: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;

}

.filter:hover {
    cursor: pointer;
}

.filter i {
    margin-left: 10px;

}

.right {
    display: flex;
    align-items: center;
}

.product-number {
    margin-right: 20px;
}

.arrays {
    display: flex;
}

.array {
    background-color: black;
    width: 40px;
    height: 30px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.array:last-child {
    margin: 0;
}

.array:hover {
    cursor: pointer;
}

.spot {
    width: 5px;
    height: 5px;
    background-color: white;
    margin: 2px;
}

.content {
    display: flex;
}

.products {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    height: 100%;
}

.product {
    margin-bottom: 20px;
    box-sizing: border-box;
    text-align: center;
}

.product-container {
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
}

.product-container:hover {
    cursor: pointer;
}

.product-container i {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 25px;
    width: 35px;
    height: 35px;
    border-radius: 35px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

.product-infos {
    height: 100px;
    padding-top: 10px
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

.product-container:hover .cover {
    bottom: 0;
    transition: 0.5s;
}

.sizes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.size {
    margin: 5px 10px;
    font-size: 18px;
    font-weight: bold;
}

.size:hover {
    color: blue;
    border-bottom: 1px solid blue;
}

.product-name {
    font-weight: bold;
    font-size: 18px;
}

.prices {
    display: flex;
    justify-content: center;
}

.price {
    margin-right: 10px
}

.discount {
    color: red;
    font-size: 14px;
}

.more {
    font-size: 14px;
    color: gray;
}

.product-name,
.price,
.discount {
    margin-bottom: 5px
}

.load {
    margin: 10px auto 15px;
    width: 200px;
    height: 40px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
}

.load:hover {
    cursor: pointer;
    color: white;
    background-color: black;
}
.filterFixed{
    padding-top: 80px;
}

@media screen and (max-width:1024px) {
    .container {
        padding: 0 10px;
    }

    .nav {
        margin-right: 10px;
        height: 200px;
    }

    .name{
        font-size: 16px;
    }

    .product-name {
        font-size: 16px;
    }

    .price {
        font-size: 14px;
    }

    .more {
        font-size: 14px;
    }
}

@media screen and (max-width:767px) {
    .title {
        font-size: 25px;
        margin: 20px 0;
    }

    .filter {
        width: 100%;
        margin-bottom: 10px;
    }

    .filter-container {
        flex-direction: column;
    }

    .right {
        justify-content: space-between;
        width: 100%;
    }

    .filter-container.is-fixed {
        padding: 10px 20px 10px 0;
    }

    .array {
        height: 25px;
    }

    .products {
        gap: 10px;
    }

    .product-container i {
        top: 15px;
        right: 15px;
        font-size: 20px;
        width: 30px;
        height: 30px;
        border-radius: 30px;
    }

    .choose {
        font-size: 14px
    }

    .size {
        font-size: 16px;
        margin: 5px 5px 0 0;
    }

    .special {
        font-size: 10px;
        width: 40px;
    }

    .load {
        width: 150px;
        height: 30px;
        font-size: 16px;
    }
    .filterFixed{
       padding-top: 115px;
    }
   
}

@media screen and (max-width:414px) {
    .container {
        padding: 0 5px;
    }

    .product-container i {
        top: 5px;
        right: 5px;
        font-size: 16px;
        width: 20px;
        height: 20px;
        border-radius: 20px;
    }

    .filter-container {
        padding-right: 10px;
    }

    .filter-type {
        font-size: 14px;
        padding: 3px 8px
    }

    .cover {
        height: 80px;
        bottom: -80px;
    }

    .choose {
        font-size: 12px
    }

    .size {
        font-size: 14px;
    }

    .special {
        top: 5px;
        left: 5px;
        height: 15px;
    }

    .product-name {
        font-size: 12px;
    }

    .price {
        font-size: 12px;
    }

    .discount {
        font-size: 12px;
    }

    .more {
        font-size: 12px;
    }

    .load {
        font-size: 14px;
    }
}
</style>
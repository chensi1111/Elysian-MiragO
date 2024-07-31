<template>
  <div class="header">
    <div class="container">
      <div class="logo">
        <img src="@/assets/logo.png" @click="toHome" />
      </div>
      <div class="genders">
        <div class="gender" @click="toMan" :class="{ active: currentGenderStore.currentGender === 'man' }">
          男士
        </div>
        <div class="gender" @click="toWoman" :class="{ active: currentGenderStore.currentGender === 'woman' }">
          女士
        </div>
      </div>
      <div class="search" v-if="largeScreen">
        <el-input v-model="search" placeholder="搜尋" @keydown.enter="searchKeyWord">
          <template #suffix>
            <i class="fa-solid fa-magnifying-glass" @click="searchKeyWord"></i>
          </template>
        </el-input>
      </div>
      <div class="icons" v-if="!smallScreen">
        <i class="fa-regular fa-user" @click="toLogin" v-if="!isSignedIn"></i>
        <el-dropdown>
          <i class="member fa-solid fa-user" @click="toMember" v-if="isSignedIn"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>您好，{{ currentUser?.displayName }}</el-dropdown-item>
              <el-dropdown-item divided @click="toMember">我的帳戶</el-dropdown-item>
              <el-dropdown-item @click="handleSignOut">登出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <i class="fa-solid fa-heart" @click="toFavorite"></i>
        <i class="fa-solid fa-cart-shopping" @mouseover="openCart"></i>
      </div>
      <div class="burger" @click="toggleRwd" v-if="smallScreen">
        <div class="bar" :class="{ bar1: isRwdOpen, close: !isRwdOpen }"
          :style="{ backgroundColor: isRwdOpen ? 'white' : 'black' }">
          &nbsp;
        </div>
        <div class="bar" :class="{ bar2: isRwdOpen, close: !isRwdOpen }"
          :style="{ backgroundColor: isRwdOpen ? 'white' : 'black' }">
          &nbsp;
        </div>
        <div class="bar" :class="{ bar3: isRwdOpen, close: !isRwdOpen }"
          :style="{ backgroundColor: isRwdOpen ? 'white' : 'black' }">
          &nbsp;
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="catalog sale" @click="showNavInfo('sale')">Sale</div>
      <div class="catalog" @click="showNavInfo('clothing')">所有服飾</div>
      <div class="catalog" @click="showNavInfo('sports')">運動休閒</div>
      <div class="catalog" @click="showNavInfo('underwear')">內衣</div>
      <div class="catalog" @click="showNavInfo('accessory')">配件</div>
    </div>
  </div>

  <div class="side-nav" :style="{ left: isOpen ? '0' : '-100%' }">
    <div class="cancle" @click="toggleSideNav">x</div>
    <div class="nav">
      <div class="catalogs">
        <div class="catalog sale" @click="showNavInfo('sale')">Sale</div>
        <div class="catalog" @click="showNavInfo('clothing')">所有服飾</div>
        <div class="catalog" @click="showNavInfo('sports')">運動休閒</div>
        <div class="catalog" @click="showNavInfo('underwear')">內衣</div>
        <div class="catalog" @click="showNavInfo('accessory')">配件</div>
      </div>
      <div class="block">
        <div class="infos" v-show="navInfo === 'sale'">
          <div class="info" @click="toSaleClothes('')">所有服飾</div>
          <div class="info" @click="toSaleClothes('sport')">運動休閒</div>
          <div class="info" @click="toSaleClothes('underwear')">內衣</div>
          <div class="info" @click="toSaleClothes('accessory')">配件</div>
        </div>
        <div class="infos" v-show="navInfo === 'clothing'">
          <div class="info" @click="toClothes('')">所有商品</div>
          <div class="info" v-show="currentGenderStore.currentGender === 'man'" @click="toClothes('suit')">T 恤 + Polo 衫
          </div>
          <div class="info" v-show="currentGenderStore.currentGender === 'woman'" @click="toClothes('suit')">T 恤 + 背心
          </div>
          <div class="info" @click="toClothes('shirt')">襯衫 </div>
          <div class="info" v-show="currentGenderStore.currentGender === 'woman'" @click="toClothes('skirt')">洋裝+裙裝
          </div>
          <div class="info" v-show="currentGenderStore.currentGender === 'man'" @click="toClothes('sport-suit')">運動衫
          </div>
          <div class="info" @click="toClothes('coat')">大衣 + 外套</div>
          <div class="info" @click="toClothes('jeans')">牛仔褲</div>
          <div class="info" @click="toClothes('pant')">長褲 + 短褲</div>
          <div class="info" @click="toClothes('sport')">運動服飾</div>
          <div class="info" @click="toClothes('underwear')">內衣</div>
          <div class="info" @click="toClothes('accessory')">配件</div>
        </div>
        <div class="infos" v-show="navInfo === 'sports'">
          <div class="info" @click="toClothes('sport')">所有商品</div>
          <div class="info" v-show="currentGenderStore.currentGender === 'man'" @click="toClothes('gym-suit')">T 恤 + 背心
          </div>
          <div class="info" v-show="currentGenderStore.currentGender === 'woman'" @click="toClothes('sport-bra')">運動內衣
          </div>
          <div class="info" v-show="currentGenderStore.currentGender === 'woman'" @click="toClothes('legging')">緊身褲
          </div>
          <div class="info" @click="toClothes('sport-suit')">運動衫</div>
          <div class="info" @click="toClothes('sport-pant')">運動褲</div>
        </div>
        <div class="infos" v-show="navInfo === 'underwear'">
          <div class="info" @click="toClothes('underwear')">所有商品</div>
          <div class="info" v-show="currentGenderStore.currentGender === 'woman'" @click="toClothes('bra')">胸罩</div>
          <div class="info" v-show="currentGenderStore.currentGender === 'woman'" @click="toClothes('panties')">內褲</div>
          <div class="info" v-show="currentGenderStore.currentGender === 'man'" @click="toClothes('boxers')">平口褲</div>
          <div class="info" v-show="currentGenderStore.currentGender === 'man'" @click="toClothes('boxer-briefs')">四角褲
          </div>
          <div class="info" v-show="currentGenderStore.currentGender === 'man'" @click="toClothes('briefs')">三角褲</div>
        </div>
        <div class="infos" v-show="navInfo === 'accessory'">
          <div class="info" @click="toClothes('accessory')">所有商品</div>
          <div class="info" @click="toClothes('shoe')">鞋子</div>
          <div class="info" @click="toClothes('hat')">帽子</div>
          <div class="info" @click="toClothes('bag')">包款</div>
          <div class="info" @click="toClothes('wallet')">皮夾</div>
          <div class="info" @click="toClothes('belt')">皮帶</div>
        </div>
        <div class="pic">
          <img :src="getNavPic">
        </div>
      </div>
    </div>
  </div>
  <div class="rwd" :style="{ right: isRwdOpen ? '0' : '-100%' }" v-if="smallScreen">
    <div class="burger rwd-burger" @click="toggleRwd">
      <div class="bar" :class="{ bar1: isRwdOpen, close: !isRwdOpen }"
        :style="{ backgroundColor: isRwdOpen ? 'white' : 'black' }">
        &nbsp;
      </div>
      <div class="bar" :class="{ bar2: isRwdOpen, close: !isRwdOpen }"
        :style="{ backgroundColor: isRwdOpen ? 'white' : 'black' }">
        &nbsp;
      </div>
      <div class="bar" :class="{ bar3: isRwdOpen, close: !isRwdOpen }"
        :style="{ backgroundColor: isRwdOpen ? 'white' : 'black' }">
        &nbsp;
      </div>
    </div>
    <div class="rwd-navs">
      <div class="rwd-nav" @click="toLogin" v-if="!isSignedIn">登入<i class="fa-regular fa-user"></i></div>
      <div class="rwd-nav" @click="toMember" v-if="isSignedIn">我的帳戶<i class="fa-solid fa-user"></i></div>
      <div class="rwd-nav" @click="toFavorite">喜愛列表<i class="fa-solid fa-heart"></i></div>
      <div class="rwd-nav" @click="toShoppingCart">購物車<i class="fa-solid fa-cart-shopping"></i></div>
      <div class="rwd-nav" @click="handleSignOut" v-if="isSignedIn">登出<i class="fa-solid fa-right-from-bracket"></i></div>
    </div>


  </div>
</template>

<script lang="ts">
export default {
  name: "TheHeader",
};
</script>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useShoppingCartStore } from "@/stores/shoppingCart";
import { useCurrentGenderStore } from "@/stores/currentGender";
import { useProductFilterStore } from "@/stores/productFilter";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import manClothingImg from "@/assets/man/normal.jpg"
import manSportsImg from "@/assets/man/fitness.jpg"
import manUnderwearImg from "@/assets/man/underwear.jpg"
import manAccessoryImg from "@/assets/man/accessory.jpg"
import manSaleImg from "@/assets/man/sale.jpg"
import womanClothingImg from "@/assets/woman/normal.jpg"
import womanSportsImg from "@/assets/woman/fitness.jpg"
import womanUnderwearImg from "@/assets/woman/underwear.jpg"
import womanAccessoryImg from "@/assets/woman/accessory.jpg"
import womanSaleImg from "@/assets/woman/sale.jpg"


const auth = getAuth();
const currentUser = ref()
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser.value = user
  }
});

//登入狀態
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    user ? (isSignedIn.value = true) : (isSignedIn.value = false);
  });
});

//登出
const isSignedIn = ref(false);
const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      isSignedIn.value = false;
      router.push({
        path: '/login'
      })
    })
    .catch((error) => {
      console.log("登出失敗", error);
    });
};


//搜尋功能
const search = ref("");
function searchKeyWord() {
  productFilterStore.isSale = false;
  productFilterStore.resetLoad();
  if (currentGenderStore.currentGender === 'man') {
    router.push({ path: "/man/clothes" }).then(() => {
      productFilterStore.keywordFilter = search.value
    });
  } else {
    router.push({ path: "/woman/clothes" }).then(() => {
      productFilterStore.keywordFilter = search.value
    });
  }

}

//開關側邊欄
const isOpen = ref(false);
function toggleSideNav() {
  isOpen.value = !isOpen.value;
}

//顯示側邊欄目錄
const navInfo = ref<string | null>(null);
function showNavInfo(catalog: string) {
  navInfo.value = catalog;
  isOpen.value = true;
}

//顯示側邊欄圖片
const getNavPic = computed(() => {
  if (currentGenderStore.currentGender === 'man') {
    switch (navInfo.value) {
      case "sale":
        return manSaleImg;
      case "clothing":
        return manClothingImg;
      case "sports":
        return manSportsImg;
      case "underwear":
        return manUnderwearImg;
      case "accessory":
        return manAccessoryImg;
      default:
        return '';
    }
  } else if (currentGenderStore.currentGender === 'woman') {
    switch (navInfo.value) {
      case "sale":
        return womanSaleImg;
      case "clothing":
        return womanClothingImg;
      case "sports":
        return womanSportsImg;
      case "underwear":
        return womanUnderwearImg;
      case "accessory":
        return womanAccessoryImg;
      default:
        return '';
    }
  }
  return '';
});

//開關購物車
const shoppingCartStore = useShoppingCartStore();
function openCart() {
  isRwdOpen.value=false
  shoppingCartStore.openCart()
}


//路由
const currentGenderStore = useCurrentGenderStore()
const router = useRouter();
function toHome() {
  if (currentGenderStore.currentGender === 'man') {
    router.push({
      path: "/man",
    });
  } else {
    router.push({
      path: "/woman",
    });
  }
}
function toMan() {
  currentGenderStore.toMan()
  router.push({
    path: "/man",
  });
}
function toWoman() {
  currentGenderStore.toWoman()
  router.push({
    path: "/woman",
  });
}
function toFavorite() {
  isRwdOpen.value=false
  router.push({
    path: "/favorite"
  })
}
function toLogin() {
  isRwdOpen.value=false
  router.push({
    path: "/login"
  })
}
function toMember() {
  router.push({
    path: "/member"
  })
}
function toShoppingCart(){
  isRwdOpen.value=false
  router.push({
    path:"/shoppingCart"
  })
}

const productFilterStore = useProductFilterStore()
function toClothes(filter: string | string[]) {
  isOpen.value = false;
  productFilterStore.isSale = false;
  productFilterStore.resetLoad();

  if (currentGenderStore.currentGender === 'man') {
    router.push({ path: "/man/clothes" }).then(() => {
      productFilterStore.typeFilter = filter;
    });
  } else {
    router.push({ path: "/woman/clothes" }).then(() => {
      productFilterStore.typeFilter = filter;
    });
  }

}
function toSaleClothes(filter: string | string[]) {
  isOpen.value = false
  productFilterStore.isSale = true
  productFilterStore.resetLoad()

  if (currentGenderStore.currentGender === 'man') {
    router.push({ path: "/man/clothes" }).then(() => {
      productFilterStore.typeFilter = filter;
    });
  } else {
    router.push({ path: "/woman/clothes" }).then(() => {
      productFilterStore.typeFilter = filter;
    });
  }
}

const largeScreen = ref(true)
const smallScreen = ref(false)
function checkScreenSize() {
  if (window.innerWidth >= 1024) {
    largeScreen.value = true
    smallScreen.value = false
  } else if (window.innerWidth >= 767 && window.innerWidth < 1024) {
    largeScreen.value = true
    smallScreen.value = false
  }
  else if (window.innerWidth < 767) {
    largeScreen.value = false
    smallScreen.value = true
  }
}
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize);
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

//RWD選單
//導覽頁
const isRwdOpen = ref(false);
function toggleRwd() {
  isRwdOpen.value = !isRwdOpen.value;
}

</script>

<style scoped>
.header {
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
  padding-bottom: 20px;
  background-color: white;
  z-index: 100;
}

.container {
  display: flex;
  justify-content: space-between;
  height: 100px;
  align-items: center;
}

.logo {
  max-width: 250px;
  display: flex;
  align-items: center;
}

img {
  width: 100%;
}

img:hover {
  cursor: pointer;
}

.genders {
  display: flex;
  align-items: center;
}

.gender {
  color: gray;
  margin: 15px;
  font-size: 18px;
  font-weight: bold;
}

.gender:hover {
  cursor: pointer;
}

.gender.active {
  color: black;
}

.search {
  width: 25%;
  display: flex;
  align-items: center;
}

.search i {
  font-size: 18px;
}

.search i:hover {
  cursor: pointer;
}

.el-input__wrapper {
  background-color: rgba(128, 128, 128, 0.1) !important;
}

.el-input__inner {
  height: 40px !important;
  font-size: 20px !important;
}

.el-input__suffix {
  font-size: 20px !important;
  color: black !important;
}

.el-input__suffix:hover {
  cursor: pointer;
}

.icons {
  width: 20%;
  margin-right: 30px;
  display: flex;
  justify-content: end;
  align-items: center;
}

.icons i {
  font-size: 30px;
  margin-right: 30px;
}

.icons i:hover {
  cursor: pointer;
}

.el-dropdown {
  color: black;
}

.el-dropdown-menu {
  width: 200px
}

.nav {
  display: flex;
  margin-top: 10px;
  padding-left: 10%;
  position: relative;
}

.catalog {
  font-size: 20px;
  font-weight: bold;
  margin-right: 30px;
}

.catalog.sale {
  color: red;
}

.catalog:hover {
  cursor: pointer;
}

.side-nav {
  background-color: black;
  height: 100vh;
  width: 100%;
  z-index: 100;
  position: fixed;
  left: -100%;
  transition: 0.3s;
  padding-top: 100px;
}

.side-nav .nav {
  flex-direction: column;
}

.side-nav .catalog {
  color: white;
}

.side-nav .sale {
  color: red;
}

.catalogs {
  display: flex;
}

.cancle {
  position: absolute;
  top: 50px;
  right: 50px;
  font-size: 35px;
  color: white;
}

.cancle:hover {
  cursor: pointer;
}

.block {
  color: white;
  margin-top: 50px;
  height: 350px;
  display: flex;
}

.infos {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 50%;
}

.info {
  font-size: 18px;
  margin: 15px 0;
  width: 200px;
}

.info.sale {
  color: red;
}

.info:hover {
  cursor: pointer;
  text-decoration: underline;
}

.pic {
  width: 35%;
}

.pic img {
  width: 100%
}

@media screen and (max-width:1024px) {
  .icons {
    margin-right: 15px;
  }

  .icons i {
    margin-right: 15px;
  }

  .gender {
    margin: 0 10px;
  }

  .catalog {
    font-size: 18px;
    margin-right: 20px;
  }

  .info {
    width: 150px;
    font-size: 16px;
  }
  
}

@media screen and (max-width:767px) {
  .logo {
    max-width: 200px;
  }

  .burger {
    width: 50px;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
  }

  .bar {
    width: 30px;
    height: 4px;
    margin: 4px;
    background-color: black;
  }

  .bar1 {
    transform: translateY(12px) rotate(45deg);
    transition: 0.8s;
  }

  .bar2 {
    opacity: 0;
    transition: 0.8s;
  }

  .bar3 {
    transform: translateY(-12px) rotate(-45deg);
    transition: 0.8s;
  }

  .close {
    transform: translateY(0) rotate(0);
    opacity: 1;
    transition: 0.8s;
  }

  .burger:hover {
    cursor: pointer;
  }

  .rwd {
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 100;
    transition: 0.3s;
    position: fixed;
  }

  .rwd-burger {
    position: absolute;
    top: 25px;
    right: 0;
  }
  .rwd-navs{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .rwd-nav {
    color: white;
    font-size: 25px;
    margin-bottom: 25px;
  }
  .rwd-nav:hover{
    cursor: pointer;
  }
  .rwd-nav i{
    margin-left: 10px;
  }
  .infos{
    width: 100%;
  }
  
  .pic{
    display: none;
  }
  .cancle{
    right: 20px;
  }
}

@media screen and (max-width:414px) {
  .logo {
    max-width: 150px;
  }
  .gender {
    margin-right: 3px;
    font-size: 16px;
  }
  .nav{
    padding-left: 15px;
  }
  .burger {
    margin-right: 10px;
  }
  .catalog{
    font-size: 16px;
    margin-right: 10px;
  }
}
</style>
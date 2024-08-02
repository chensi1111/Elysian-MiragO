<template>
  <div class="subscribe">
    <div class="info">訂閱我們</div>
    <div class="info small">掌握最新活動，不錯失任何優惠</div>
    <div class="block">
      <div class="input-container">
        <input type="text" placeholder="Email" v-model="email" />
        <div class="error">{{ errorEmail }}</div>
      </div>
      <div class="button" @click="subscribe">訂閱</div>
    </div>
  </div>
  <div class="container" v-if="!smallScreen">
    <div class="navs">
      <div class="title">訂單</div>
      <div class="nav" @click="toOrderManage()">訂單管理</div>
    </div>
    <div class="navs">
      <div class="title">客服服務</div>
      <div class="nav" @click="toContact">聯絡我們</div>
      <div class="nav" @click="toQA">常見問題</div>
      <div class="nav" @click="toReturn">退貨方式</div>
      <div class="nav" @click="toShipping">送貨方式</div>
    </div>
    <div class="navs">
      <div class="title">品牌資訊</div>
      <div class="nav" @click="toAbout">關於我們</div>
    </div>
    <div class="navs">
      <div class="title">探索</div>
      <div class="nav" @click="toMan()">男裝</div>
      <div class="nav" @click="toWoman()">女裝</div>
    </div>
  </div>
  <div class="rwd-container" v-if="smallScreen">
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <div class="rwd-title">訂單</div>
        </template>
        <div class="rwd-nav" @click="toOrderManage()">訂單管理</div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template #title>
          <div class="rwd-title">客服服務</div>
        </template>
        <div class="rwd-nav" @click="toContact">聯絡我們</div>
        <div class="rwd-nav" @click="toQA">常見問題</div>
        <div class="rwd-nav" @click="toReturn">退貨方式</div>
        <div class="rwd-nav" @click="toShipping">送貨方式</div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template #title>
          <div class="rwd-title">品牌資訊</div>
        </template>
        <div class="rwd-nav" @click="toAbout">關於我們</div>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template #title>
          <div class="rwd-title">探索</div>
        </template>
        <div class="rwd-nav" @click="toMan()">男裝</div>
        <div class="rwd-nav" @click="toWoman()">女裝</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentGenderStore } from "@/stores/currentGender";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { ElMessage } from 'element-plus';

//訂閱
const email = ref<string>("")
const errorEmail = ref<string>("")
function subscribe() {
  errorEmail.value=""
  if (!email.value) {
    errorEmail.value = 'Email不得為空'
    ElMessage({ type: 'error', message: '訂閱失敗', })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorEmail.value = 'Email格式錯誤'
    ElMessage({ type: 'error', message: '訂閱失敗', })
  } else (
    ElMessage({ type: 'success', message: '訂閱成功', })
  )
}

//RWD
const smallScreen = ref<boolean>(false)
function checkScreenSize() {
  if (window.innerWidth < 767) {
    smallScreen.value = true
  } else {
    smallScreen.value = false
  }
}
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize);
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

//firestore
const auth = getAuth();
const currentUser = ref<User|null>()
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

const isSignedIn = ref<boolean>(false);

//路由
const router = useRouter()
const currentGenderStore = useCurrentGenderStore()
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
function toOrderManage() {
  if (isSignedIn.value) {
    router.push({
      path: "/orders"
    })
  } else {
    router.push({
      path: "/login"
    })
  }
}
function toContact(){
    router.push({
        path:'/custom'
    })
} 
function toQA(){
    router.push({
        path:'/custom/QA'
    })
} 
function toReturn(){
    router.push({
        path:'/custom/return'
    })
} 
function toShipping(){
    router.push({
        path:'/custom/shipping'
    })
} 
function toAbout(){
    router.push({
        path:'/custom/about'
    })
} 
</script>

<style scoped>
.subscribe {
  background-color: black;
  padding: 20px 50px;
}

.info {
  font-size: 30px;
  color: white;
}

.info.small {
  margin-top: 5px;
  font-size: 18px;
}

.block {
  display: flex;
  margin-top: 15px;
}

.error {
  color: red;
  margin-top: 5px;
}

input {
  width: 250px;
  height: 35px;
  margin-right: 20px;
  border: 1px;
  box-sizing: border-box;
  padding-left: 10px;
}

.button {
  width: 250px;
  height: 35px;
  background-color: white;
  color: black;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button:hover {
  cursor: pointer;
}

.container {
  display: flex;
  padding: 50px 20px;
  justify-content: space-between;
}

.navs {
  display: flex;
  flex-direction: column;
  width: 15%;
  margin: 0 30px;
}

.title {
  font-weight: bold;
  font-size: 16px;
  margin: 5px 0;
}

.nav {
  font-size: 16px;
  margin: 5px 0;
}

.nav:hover {
  cursor: pointer;
}

@media screen and (max-width:767px) {
  .el-collapse {
    padding: 0 20px;
  }

  .rwd-title {
    font-size: 16px;
  }

  .rwd-nav {
    padding-left: 10px;
    font-size: 14px;
  }
  
  .subscribe {
    padding: 20px;
  }

  input {
    width: 150px;
  }

  .rwd-container {
    padding-bottom: 30px
  }
}

@media screen and (max-width:414px) {
  .info {
    font-size: 25px;
  }

  .info.small {
    font-size: 16px;
  }
}
</style>
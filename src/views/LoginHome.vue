<template>
    <div class="inputs">
        <el-input placeholder="信箱" v-model="email" :class="{ 'error-border': errorEmail }"></el-input>
        <el-input placeholder="密碼" v-model="password"  show-password :class="{ 'error-border': errorPassword }" @keydown.enter="signIn"></el-input>
    </div>
    <div class="button" @click="signIn">登入</div>
    <div class="button" @click="toRegister">建立新帳戶</div>
    <div class="error" v-show="errorEmail">{{ errorEmail }}</div>
    <div class="error" v-show="errorPassword">{{ errorPassword }}</div>
    <el-dialog v-model="dialogVisible" title="提示" :width="dialogWidth">
    <span>登入成功，{{ count }}秒後將自動跳轉</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmSignIn"> 確認 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref ,onMounted,onBeforeUnmount} from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useCurrentGenderStore } from '@/stores/currentGender';
import { previousRoute } from '@/router';

const email=ref()
const password=ref()
const errorEmail=ref()
const errorPassword=ref()
const dialogVisible=ref(false)
const count=ref(3)
const auth = getAuth();

//登入
const signIn = () => {
  errorEmail.value = "";
  errorPassword.value = "";
  if(!email.value){
    errorEmail.value = "Email不能為空";
    return;
  }
  if(!password.value){
    errorPassword.value = "密碼不能為空";
    return;
  }
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      //3秒後自動跳轉
      dialogVisible.value = true;
      const counting = setInterval(() => {
        count.value--;
        if (count.value === 0) {
          clearInterval(counting);
          confirmSignIn();
        }
      }, 1000);
    })
    .catch((error) => {
      if (error.code === "auth/invalid-email") {
        errorEmail.value = "請輸入正確Email";
      }
      if (error.code === "auth/missing-password") {
        errorPassword.value = "密碼不能為空";
      }
      if (error.code === "auth/invalid-credential") {
        errorPassword.value = "密碼錯誤";
      }
    });
};
//路由方法
const router=useRouter()
const currentGenderStore=useCurrentGenderStore()
function toRegister() {
  router.push({
    path: "/login/register",
  });
}
function confirmSignIn() {
  dialogVisible.value = false;
  //跳回上個路由或首頁
  if (previousRoute.value) {
    router.push(previousRoute.value);
  } else {
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
}

//根據視窗大小改變dialog
const dialogWidth = ref("500");
const checkWindowSize = () => {
  dialogWidth.value = window.innerWidth < 767 ? "300" : "500";
};

onMounted(() => {
  checkWindowSize();
  window.addEventListener("resize", checkWindowSize);
  previousRoute.value = router.currentRoute.value.query.redirect || "/";
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkWindowSize);
});
</script>
<style scoped>
.inputs{
    margin-bottom: 20px;
}
.el-input {
    margin-bottom: 15px;
    height: 40px;
    font-size: 18px;
}
.el-input.error-border{
    border: 2px solid red;
}
.button {
    background-color: black;
    color: white;
    height: 40px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px
}
.button:hover{
    cursor: pointer;
}
.error{
    color:red
}
@media screen and (max-width:767px){
  .el-input{
    height: 30px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .button{
    height: 35px;
    font-size: 18px;
  }
}
</style>
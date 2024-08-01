<template>
    <el-input placeholder="姓氏" v-model="firstName" :class="{ 'error-border': errorName }"></el-input>
    <el-input placeholder="名字" v-model="lastName" :class="{ 'error-border': errorName }"></el-input>
    <el-input placeholder="信箱" v-model="email" :class="{ 'error-border': errorEmail }"></el-input>
    <el-input placeholder="電話號碼" v-model="phone" :class="{ 'error-border': errorPhone }"></el-input>
    <el-input placeholder="請輸入最少6位數密碼" v-model="password" show-password :class="{ 'error-border': errorPassword }"></el-input>
    <el-input placeholder="確認密碼" v-model="passwordCheck" show-password :class="{ 'error-border': errorPassword }" @keydown.enter="signUp"></el-input>
    <div class="button" @click="signUp">註冊</div>
    <div class="notice">已經有帳號?<span @click="toLogin">點我登入</span></div>
    <div class="error" v-show="errorName">{{ errorName }}</div>
    <div class="error" v-show="errorPhone">{{ errorPhone }}</div>
    <div class="error" v-show="errorEmail">{{ errorEmail }}</div>
    <div class="error" v-show="errorPassword">{{ errorPassword }}</div>
    <el-dialog v-model="dialogVisible" title="提示" :width="dialogWidth">
    <span>登入成功，{{ count }}秒後將自動跳轉</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmSignUp"> 確認 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref,onMounted,onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import {getAuth,createUserWithEmailAndPassword,updateProfile,} from "firebase/auth";
import {  doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase.js";

const firstName=ref("")
const lastName=ref("")
const fullName=computed(()=>{
    return firstName.value+lastName.value
})
const email=ref("")
const phone=ref("")
const password=ref("")
const passwordCheck=ref("")
const errorName=ref()
const errorEmail=ref()
const errorPassword=ref()
const errorPhone=ref()
const count=ref(3)
const dialogVisible=ref(false)

const auth = getAuth();
const signUp = () => {
  errorName.value = "";
  errorEmail.value = "";
  errorPassword.value = "";
  errorPhone.value=""

  if (!fullName.value) {
    errorName.value = "請輸入姓名";
    return;
  } 
  if (!email.value) {
    errorEmail.value = "請輸入信箱";
    return;
  } 
  if (!phone.value) {
    errorPhone.value = "請輸入電話號碼";
    return;
  }
  if (password.value !== passwordCheck.value) {
    errorPassword.value = "密碼不相同";
    return;
  }
  console.log('執行')
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      const user = userCredential.user;

      try {
        await updateProfile(user, { displayName: fullName.value });

        // 將用戶信息儲存到 Firestore
        await setDoc(doc(db, "users", user.uid), {
          phone: phone.value,
          firstName:firstName.value,
          lastName:lastName.value,
          userName:fullName.value,
          email:email.value
        });

        // 3秒後自動跳轉
        dialogVisible.value = true;
        const counting = setInterval(() => {
          count.value--;
          if (count.value === 0) {
            clearInterval(counting);
            confirmSignUp();
          }
        }, 1000);
      } catch (error) {
        ElMessage({
          message: "註冊失敗",
          type: "error",
        });
        console.log(error);
      }
    })
    .catch((error) => {
      console.log("error", error);
      if (error.code === "auth/invalid-email") {
        errorEmail.value = "請輸入正確Email";
      }
      if (error.code === "auth/email-already-in-use") {
        errorEmail.value = "該email已使用";
      } else {
          if (error.code === "auth/missing-password") {
            errorPassword.value = "密碼不能為空";
          }
          if (error.code === "auth/weak-password") {
            errorPassword.value = "密碼不能少於6位數";
          }
      }
    });
};

const router=useRouter()
function confirmSignUp() {
  dialogVisible.value = false;
  router.push({
    path: "/",
  });
}
function toLogin(){
    router.push({
        path:"/login"
    })
}
//根據視窗大小改變dialog
const dialogWidth = ref("500");
const checkWindowSize = () => {
  dialogWidth.value = window.innerWidth < 767 ? "300" : "500";
};

onMounted(() => {
  checkWindowSize();
  window.addEventListener("resize", checkWindowSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkWindowSize);
});
</script>
<style scoped>
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
.notice{
    display: flex;
    justify-content: center;
}
.notice span{
    font-weight: bold;
    margin-left: 5px
}
.notice span:hover{
    cursor:pointer
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
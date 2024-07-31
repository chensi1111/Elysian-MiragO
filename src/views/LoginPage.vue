<template>
    <div class="container">
        <div class="navs">
            <div class="nav" @click="toLogin" :class="{active:route.path=='/login'}">登入</div>
            <div class="nav" @click="toRegister" :class="{active:route.path=='/login/register'}">註冊</div>
        </div>
        <RouterView></RouterView>
    </div>
</template>
<script setup lang="ts">
import { useRouter ,useRoute} from 'vue-router';
const router=useRouter()
const route=useRoute()

function toLogin(){
    router.push({
        path:'/login'
    })
}
function toRegister(){
    router.push({
        path:'/login/register'
    })
}


</script>
<style scoped>
.container{
    width: 500px;
    background-color: rgba(200, 200, 200, 0.5 );
    margin: 100px auto;
    padding: 20px;
    box-sizing: border-box;
}
.navs{
    display: flex;
    margin-bottom: 20px;
}
.nav{
    width: 50%;
    height: 50px;
    font-size: 25px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}
.nav.active{
    border-bottom: 3px solid black
}
.nav:hover{
    cursor: pointer;
}
@media screen and (max-width:767px){
   .container{
    width: 350px;
    margin: 80px auto;
   }
   .nav{
    font-size: 20px;
   }
}
@media screen and (max-width:414px){
    .container{
        width: 300px;
        margin: 50px auto;
    }
}
</style>
<template>
    <div class="container">
        <div class="side-nav" v-if="windowWidth>=767">
            <div class="nav" @click="toContact">聯絡我們</div>
            <div class="nav" @click="toQA">常見問題</div>
            <div class="nav" @click="toReturn">退貨方式</div>
            <div class="nav" @click="toShipping">送貨方式</div>
            <div class="nav" @click="toAbout">關於我們</div>
        </div>
        <el-select
           v-model="nav"
           size="large"
           v-if="windowWidth<767">
           <el-option
              v-for="item in navOptions"
              :key="item.label"
              :label="item.label"
              :value="item.router"/>
        </el-select>
        <div class="block">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter ,useRoute} from 'vue-router';
import { ref ,onMounted,onBeforeUnmount,watch} from 'vue';

const navOptions=ref([
    {label:'聯絡我們',router:'/custom'},
    {label:'常見問題',router:'/custom/QA'},
    {label:'退貨方式',router:'/custom/return'},
    {label:'送貨方式',router:'/custom/shipping'},
    {label:'關於我們',router:'/custom/about'},
])

const route=useRoute()
const nav=ref(route.path)
watch(nav, (newVal) => {
  router.push({
    path:newVal
  })
});

//視窗寬度
const windowWidth = ref(window.innerWidth);
function updateWindowWidth() {
    windowWidth.value = window.innerWidth;
}

onMounted(() => {
    window.addEventListener('resize', updateWindowWidth);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWindowWidth);
});

//路由
const router=useRouter()
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
.container{
    padding:30px 80px;
    display: flex;
}
.side-nav{
    width: 250px;
    text-align: center;
}
.nav{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
}
.nav:hover{
    cursor: pointer;
}
.block{
    width: 100%;
}
@media screen and (max-width:1024px){
    .container{
        padding: 30px 50px;
    }    
}
@media screen and (max-width:767px){
    .container{
        padding: 30px 10px;
        flex-direction: column;
    }
    .el-select{
        margin-bottom: 20px;
    }
}
</style>
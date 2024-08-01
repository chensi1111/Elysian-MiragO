<template>
    <div class="back" @click="toMember"><i class="fa-solid fa-arrow-left"></i>返回我的帳戶</div>
    <div class="container">
        <div class="titles">
            <div class="title">訂單管理</div>
            <div class="sub-titles" v-if="windowWidth>=767">
                <div class="sub-title" @click="allOrder">所有訂單</div>
                <div class="sub-title" @click="handleOrder">處理中訂單</div>
                <div class="sub-title" @click="completeOrder">已完成訂單</div>
                <div class="sub-title" @click="cancelOrder">已取消訂單</div>
            </div> 
        </div>
        <el-select
           v-model="nav"
           size="large"
           v-if="windowWidth<767">
           <el-option
              v-for="item in navOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"/>
        </el-select>
        <div class="block">
            <div class="order-title">{{currentOrder.orderType}}</div>
            <TheOrders></TheOrders>
        </div>
    </div>
</template>
<script setup lang="ts">
import TheOrders from '@/components/TheOrders.vue';
import { useCurrentOrderStore } from '@/stores/currentOrder';
import { ref,onMounted,onBeforeUnmount ,watch} from 'vue';
import { useRouter } from 'vue-router';

//切換訂單
const currentOrder=useCurrentOrderStore()
onMounted(()=>{
    currentOrder.orderType="所有訂單"
})
function allOrder(){
    currentOrder.orderType="所有訂單"
}
function handleOrder(){
    currentOrder.orderType="處理中訂單"
}
function completeOrder(){
    currentOrder.orderType="已完成訂單"
}
function cancelOrder(){
    currentOrder.orderType="已取消訂單"
}

//RWD選單
const navOptions=ref([
    {value:'所有訂單'},
    {value:'處理中訂單'},
    {value:'已完成訂單'},
    {value:'已取消訂單'},
])

const nav=ref()

watch(nav, (newVal) => {
    currentOrder.orderType=newVal
});

//視窗寬度
const windowWidth = ref(window.innerWidth);
function updateWindowWidth() {
    windowWidth.value = window.innerWidth;
}

onMounted(() => {
    window.addEventListener('resize', updateWindowWidth);
    nav.value=currentOrder.orderType
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWindowWidth);
});

//路由
const router=useRouter()
function toMember(){
    router.push({
        path:'/member'
    })
}
</script>
<style scoped>
.back{
    margin:20px 0 0 50px;
    font-size: 18px;
    width: 150px;
}
.back:hover{
    cursor: pointer;
    font-weight: bold
}
i{
    margin-right: 5px
}
.container{
    padding:30px 50px;
    display: flex;
}
.titles{
    width: 150px;
    margin-right: 100px;
    padding: 10px;
    box-sizing: border-box;
}
.title {
  font-size: 25px;
  color: black;
  font-weight: bold;
  padding-bottom: 15px;
  border-bottom: 2px solid black;
  margin-bottom: 20px;
}
.sub-title{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}
.order-title{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
}
.sub-title:hover{
    cursor: pointer;
    color: blue;
}
.block {
    width: 50%;
    background-color: rgba(200, 200, 200, 0.5);
    padding: 10px 20px;
    margin-bottom: 25px;
}

@media screen and (max-width:1024px){
    .titles{
        margin-right: 50px;
    }
    .block{
        width: 80%;
    }
}
@media screen and (max-width:767px){
    .back{
        margin: 20px 0 0 20px;
        font-size: 16px;
    }
    .container{
        padding: 10px 20px 20px;
        flex-direction: column;
        align-items: center;
    }
    .titles{
        width: 100%;
        margin: 0;
    }
    .sub-titles{
        display: flex;
        justify-content: space-evenly;
    }
    .sub-title{
        font-size: 16px;
    }
    .block{
        margin-top: 20px;
        width: 90%;
    }
}
@media screen and (max-width:414px){
    .back{
        margin: 10px 0 0 5px
    }
    .container{
        padding: 10px 5px
    }
    .title{
        font-size: 20px;
    }
    .order-title{
        font-size: 16px;
    }
    .sub-title{
        font-size: 14px;
    }
}
</style>

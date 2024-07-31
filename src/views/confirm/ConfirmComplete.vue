<template>
    <div class="container">
        <div class="title">訂單完成</div>
        <div class="count">在{{count}}秒後跳轉</div>
        <div class="button" @click="toMember">立即跳轉</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,watch } from 'vue';
import { useRouter } from 'vue-router';


const count = ref(3)
function timeCount() {
    const interval = setInterval(() => {
        if (count.value > 0) {
            count.value--;
        } else {
            clearInterval(interval);
        }
    }, 1000);
    onUnmounted(() => {
        clearInterval(interval);
    });
}
onMounted(() => {
    timeCount()
})

const router=useRouter()
function toMember(){
    router.push({
        path:'/member'
    })
}

watch(count,((value)=>{
    if(value==0){
        toMember()
    }
}))
</script>
<style scoped>
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    font-size: 30px;
}

.count {
    font-size: 20px;
    margin: 15px
}
.button{
    border: 1px solid black;
    padding: 5px 10px;
}
.button:hover{
    background-color: black;
    color: white;
    cursor: pointer;
}
</style>
<template>
    <div class="confirm">
        <RouterView></RouterView>
        <ConfirmInfo v-if="!showConfirmInfo"></ConfirmInfo>
    </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import ConfirmInfo from './ConfirmInfo.vue';
import { useRoute } from 'vue-router';

const route=useRoute()
const showConfirmInfo=computed(()=>{
    return route.path ==='/confirm/complete'
})
</script>

<style scoped>
.confirm{
    padding: 20px 50px;
    display: flex;
    width: 100%;
    box-sizing: border-box;
}
@media screen and (max-width:1024px){
    .confirm{
        padding: 20px;
    }
}
@media screen and (max-width:767px){
    .confirm{
        flex-direction: column;
    }
}
@media screen and (max-width:414px){
    .confirm{
        padding: 20px 10px;
    }
}
</style>
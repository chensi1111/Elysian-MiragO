<template>
  <div class="app">
    <el-backtop :right="20" :bottom="50">
    </el-backtop>
    <TheShoppingCart></TheShoppingCart>
    <TheHeader></TheHeader>
    <div class="wrapper">
      <Router-view></Router-view>
    </div>
  </div>
  <div class="footer">
    <TheFooter></TheFooter>
  </div>
</template>
<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import TheShoppingCart from "@/components/TheShoppingCart.vue"
import { RouterView } from "vue-router";

</script>
<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}
html,
body {
  margin: 0;
  font-family: "Microsoft JhengHei", 微軟正黑體, Arial, sans-serif;
}
.wrapper {
  margin-top: 150px;
}

@media screen and (max-width:767px){
  .el-backtop{
    height: 30px !important;
    width: 30px !important;
  }
  .el-message{
  width: 100% !important;
  padding: 10px 5px !important;
}
}
@media screen and (max-width:414px){
  .el-backtop{
    height: 25px !important;
    width: 25px !important;
  }
  
}
</style>

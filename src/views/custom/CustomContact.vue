<template>
    <div class="title">聯絡我們</div>
    <div class="info">我們非常重視您的意見與需求，如果您有任何問題、建議或需要協助，歡迎透過以下方式與我們聯繫。</div>
    <div class="sub-title">電話</div>
    <div class="type"><i class="fa-solid fa-phone"></i>客服專線 : <a href="tel:+88612345678">+886-12345678</a></div>
    <div class="info">我們的客服團隊將隨時準備為您提供協助。</div>
    <div class="sub-title">電子郵件</div>
    <div class="type"><i class="fa-solid fa-envelope"></i>客服信箱 : <a href="mailto:ElysianMiragO@gmail.com">ElysianMiragO@gmail.com</a></div>
    <div class="info">無論是訂單查詢、產品問題或任何其他問題，我們都會在收到您的訊息後儘快回覆。</div>
    <div class="sub-title">服務時間</div>
    <div class="type"><i class="fa-solid fa-clock"></i>營業時間 : </div>
    <div class="info">週一至週五：09:00 - 18:00<br>例假日及國定假日：休息</div>
    <div class="sub-title">公司地址</div>
    <div class="type"><i class="fa-solid fa-building"></i>地址 : </div>
    <div class="info">台北市信義區XX路XXX號XX樓</div>


</template>

<script setup lang="ts">
</script>

<style scoped>
.title{
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid black;
    width: fit-content;
}
.sub-title{
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0;
}
.type{
    font-size: 16px;
    font-weight: bold;
    margin-bottom:5px
}
.info{
    line-height: 1.8;
}
a{
    color: black;
    text-decoration: none;
}
a:hover{
    color: blue;
}
i{
    margin-right:5px
}
@media screen and (max-width:767px){
    .title{
        font-size: 25px;
    }
    .sub-title{
        font-size: 18px;
    }
    .info{
        font-size: 14px;
    }
    
}
</style>
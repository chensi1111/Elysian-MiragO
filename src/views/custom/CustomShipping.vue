<template>
    <div class="title">送貨方式</div>
    <div class="sub-title">送貨時間</div>
    <div class="info">依規定，交貨時間為寄出後的 4 至 7 個工作天。<br>請注意，我們無法出貨至郵政信箱。配送時間根據所選的運送方法及不同地點的處理時間不一。</div>
    <div class="sub-title">宅配送貨</div>
    <div class="info">目前我們提供的宅配服務，此服務僅適用於台灣、金門本島和澎湖本島。<br>以下區域恕無提供宅配通貨件配送服務。</div>
    <li>澎湖地區</li>
    <li>金門地區</li>
    <li>馬祖地區(連江縣)</li>
    <li>其它：蘭嶼、綠島、小琉球等外島及郵政信箱</li>
    <div class="sub-title">運費</div>
    <div class="info">宅配為台幣150 元。<br>單筆訂單商品5件以上可享免運優惠。</div>

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
.info{
    line-height: 1.8;
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
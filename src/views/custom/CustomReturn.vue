<template>
    <div class="title">退貨政策</div>
    <div class="sub-title">商品退貨</div>
    <div class="info">依照消費者保護法規定，消費者均享有商品到貨日期（以物流簽收日期為準）次日起的七天猶豫期之權益，第7天為假日時，末日順延至次日。<br>
        超過 7天猶豫期之後，所有商品將無法退貨。<br>如您訂購時未達免運門檻：出貨時所支付之運費，退貨時恕不退還。<br>
        如您訂購時達免運門檻：訂單整筆退貨或部分退貨，退貨後訂單內剩餘商品金額未達免運門檻或為零元，將向您補收運費，退貨款將於扣除補收的運費後，依照原付款方式退還餘款。<br>
        若您購買商品時參加滿額折抵或其他優惠活動，於退回部分商品後導致您不能再享受優惠，我們有權根據購買時各商品售價進行結算，並從退款金額中扣除相應差價。
    </div>
    <div class="sub-title">退貨方式</div>
    <div class="info"><b>顧客可聯繫客戶服務員辦理退貨申請</b></div>
    <div class="info">電子信箱：<a href="mailto:Elysian-MiragO@gmail.com">Elysian-MiragO@gmail.com</a></div>
    <div class="info">客服專線：<a href="tel:+88612345678">+886-12345678</a></div>
    <div class="info">服務時間：週一至週五：09:00 - 18:00，例假日及國定假日除外</div>   
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
a{
    color: black;
    text-decoration: none;
}
a:hover{
    color: blue;
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
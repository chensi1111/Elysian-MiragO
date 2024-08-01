<template>
    <div class="title">常見問題</div>
    <div class="sub-title">一般資訊</div>
    <div class="question">官方購物網站與門市價格一樣嗎？</div>
    <div class="info">官方購物網站與門市價格一樣，不過請注意，如果網站上標示的價格與商品標價牌有所不同，將以收據上顯示的價格為準。</div>
    <div class="question">我可以取消訂閱電子報嗎？</div>
    <div class="info">當然，您可以透過點擊電子郵件頁腳的取消訂閱連結。</div>
    <div class="question">如何找回忘記的密碼？</div>
    <div class="info">如果您忘記密碼，您可以在「我的帳戶」頁面中重設密碼。提出重設密碼要求後，您將會收到一封含有新密碼的電子郵件。</div>
    <div class="sub-title last">訂單</div>
    <div class="question">我可以從訂單中刪除部分商品嗎？</div>
    <div class="info">一旦訂單確認，將無法從訂單中刪除任何商品，但您不需要的商品可於到貨七日猶豫期內辦理退貨。</div>
    <div class="question">如果我收到的商品與訂單不符，應該如何處理？</div>
    <div class="info">如果您收到瑕疵貨錯誤的商品，請致電<a href="tel:+88612345678">+886-12345678</a>或發送電子郵件至 <a href="mailto:ElysianMiragO@gmail.com">ElysianMiragO@gmail.com</a> 聯繫客戶服務團隊，以協助安排後續退貨事宜。</div>
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
.sub-title.last{
    margin-top: 30px;
}
.info{
    line-height: 1.8;
}
.question{
    font-weight: bold;
    margin-top: 10px
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
<template>
    <div class="title">關於我們</div>
    <div class="sub-title">品牌故事</div>
    <div class="info">Elysian MiragO 是一個以夢幻與現實交織為靈感的服飾品牌，誕生於追求獨特個性與精緻工藝的設計理念。<br>
        品牌名稱融合了 "Elysian"，象徵著天堂般的美好與寧靜，和 "MiragO"，代表著如海市蜃樓般虛幻而迷人的想像力。<br>
        Elysian-MiragO 致力於將這種夢幻的藝術概念融入到每一件作品中，透過細膩的剪裁與高品質的材料，造出既充滿個性又極具舒適度的時尚單品。</div>
    <div class="sub-title">設計理念</div>
    <div class="info">品牌的設計靈感來自於對自然美景與都市生活的觀察，將這些元素轉化為兼具功能性與藝術性的服飾，讓穿著者能夠在日常生活中展現出屬於自己的獨特風格。<br>
        Elysian MiragO 不僅僅是服裝，它是夢想與現實之間的一座橋樑，讓每個人都能透過時尚，表達自己心中的奇幻世界。</div>
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
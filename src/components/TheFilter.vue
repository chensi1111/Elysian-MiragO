<template>
    <div class="main-filter" >
        <div class="cancle" @click="cancleAllFilter">移除所有篩選</div>
        <div class="collapse">
            <el-collapse v-model="collapse">
                <el-collapse-item title="搜尋" name="1">
                    <el-input v-model="productFilterStore.keywordFilter" placeholder="關鍵字" @keydown.enter="searchKeyWord">
                        <template #suffix>
                            <i class="fa-solid fa-magnifying-glass" @click="searchKeyWord"></i>
                        </template>
                    </el-input>
                </el-collapse-item>
                <el-collapse-item title="排序" name="2">
                    <div class="sorts">
                        <label class="sort" @change="sortChanged">
                            <input type="radio" value="original" v-model="productFilterStore.sortFilter">推薦排序
                        </label>
                    </div>
                    <div class="sorts">
                        <label class="sort" @change="sortChanged">
                            <input type="radio" value="high" v-model="productFilterStore.sortFilter">價格由高至低
                        </label>
                    </div>
                    <div class="sorts">
                        <label class="sort" @change="sortChanged">
                            <input type="radio" value="low" v-model="productFilterStore.sortFilter">價格由低至高
                        </label>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="價格區間" name="3">
                    <div class="interval" >
                        <el-slider v-model="productFilterStore.intervalFilter" range show-stops :max="10000" @change="intervalChanged"/>
                        <div class="interavl-infos">
                            <div class="interval-info">${{ productFilterStore.intervalFilter[0] }}</div>
                            <div class="interval-info">${{ productFilterStore.intervalFilter[1] }}</div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="顏色" name="4">
                    <div class="colors">
                        <label class="color" v-for="color in colorOptions" :key="color.value">
                            <input type="checkbox" :value="color.value" v-model="productFilterStore.colorFilter" @change="colorChanged">
                            <div class="spot" :style="{ backgroundColor: color.color }"></div>
                            {{ color.label }}
                        </label>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="尺寸" name="5">
                    <div class="sizes">
                        <div class="size" v-for="(size, index) in sizeOptions" :key="index" @click="selectSize(size)"
                            :class="{ 'select': productFilterStore.sizeFilter.includes(size) }">
                            {{ size }}
                        </div>
                    </div>
                    <div class="sizes">
                        <div class="size" v-for="(size, index) in accessorySizeOptions" :key="index"
                            @click="selectSize(size)" :class="{ 'select': productFilterStore.sizeFilter.includes(size) }">
                            {{ size }}
                        </div>
                    </div>
                    <div class="sizes" v-if="currentGenderStore.currentGender == 'woman'">
                        <div class="size" v-for="(cup, index) in cupOptions" :key="index" @click="selectSize(cup)"
                            :class="{ 'select': productFilterStore.sizeFilter.includes(cup) }">
                            {{ cup }}
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="類別" name="6">
                    <el-collapse v-model="typeCollapse">
                        <el-collapse-item title="所有服飾" name="1" class="typeCollapse">
                            <div class="type" @click="selectType('')">所有商品</div>
                            <div class="type" @click="selectSale('')">特價商品</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'woman'"
                                @click="selectType('suit')">T恤 & 背心</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'man'"
                                @click="selectType('t-shirt')">T恤 & polo衫
                            </div>
                            <div class="type" @click="selectType('shirt')">襯衫</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'man'"
                                @click="selectType('sport-suit')">運動衫</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'woman'"
                                @click="selectType('skirt')">洋裝 & 裙裝</div>
                            <div class="type" @click="selectType('coat')">大衣 & 外套</div>
                            <div class="type" @click="selectType('jeans')">牛仔褲</div>
                            <div class="type" @click="selectType('pant')">長褲短褲</div>
                            <div class="type" @click="selectType('sport')">運動休閒</div>
                            <div class="type" @click="selectType('underwear')">內衣</div>
                            <div class="type" @click="selectType('accessory')">配件</div>
                        </el-collapse-item>
                        <el-collapse-item title="運動休閒" name="2" class="typeCollapse">
                            <div class="type" @click="selectType('sport')">所有商品</div>
                            <div class="type" @click="selectSale('sport')">特價商品</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'man'"
                                @click="selectType('gym-suit')">運動T恤 & 背心</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'woman'"
                                @click="selectType('sport-bra')">運動內衣
                            </div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'woman'"
                                @click="selectType('legging')">緊身褲</div>
                            <div class="type" @click="selectType('sport-suit')">運動衫</div>
                            <div class="type" @click="selectType('sport-pant')">運動褲</div>
                        </el-collapse-item>
                        <el-collapse-item title="內衣" name="3" class="typeCollapse">
                            <div class="type" @click="selectType('underwear')">所有商品</div>
                            <div class="type" @click="selectSale('underwear')">特價商品</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'man'"
                                @click="selectType('boxers')">平口褲</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'man'"
                                @click="selectType('boxer-briefs')">四角褲
                            </div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'man'"
                                @click="selectType('briefs')">三角褲</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'woman'"
                                @click="selectType('bra')">胸罩</div>
                            <div class="type" v-if="currentGenderStore.currentGender == 'woman'"
                                @click="selectType('panties')">內褲</div>
                        </el-collapse-item>
                        <el-collapse-item title="配件" name="4" class="typeCollapse">
                            <div class="type" @click="selectType('accessory')">所有商品</div>
                            <div class="type" @click="selectSale('accessory')">特價商品</div>
                            <div class="type" @click="selectType('shoe')">鞋子</div>
                            <div class="type" @click="selectType('hat')">帽子</div>
                            <div class="type" @click="selectType('bag')">包款</div>
                            <div class="type" @click="selectType('wallet')">皮夾</div>
                            <div class="type" @click="selectType('belt')">皮帶</div>
                        </el-collapse-item>

                    </el-collapse>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect} from 'vue'
import { useProductFilterStore } from '@/stores/productFilter';
import { useCurrentGenderStore } from '@/stores/currentGender';
const productFilterStore = useProductFilterStore()
const currentGenderStore = useCurrentGenderStore()

const collapse = ref<string[]>(['1', '2', '3', '4', '5', '6'])
const typeCollapse = ref<number[]>([])

//顏色及尺寸選項
const colorOptions = [
    { value: 'Black', color: 'black', label: '黑色' },
    { value: 'White', color: 'white', label: '白色' },
    { value: 'Blue', color: 'blue', label: '藍色' },
    { value: 'Green', color: 'green', label: '綠色' },
    { value: 'Gray', color: 'gray', label: '灰色' },
    { value: 'Yellow', color: 'yellow', label: '黃色' },
    { value: 'Red', color: 'red', label: '紅色' },
    { value: 'Brown', color: 'brown', label: '棕色' },
    { value: 'Pink', color: 'pink', label: '粉色' },
]
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL']
const accessorySizeOptions = ['24', '25', '26', 'onesize']
const cupOptions = ['32A', '32B', '32C', '32D', '34A', '34B', '34C', '34D', '36A', '36B', '36C', '36D']

//localstorage儲存的值
watchEffect(() => {
  const savedFilterState = JSON.parse(localStorage.getItem('filterState') || '{}');
  if (savedFilterState.sortFilter) {
    productFilterStore.sortFilter = savedFilterState.sortFilter;
  }
  if (savedFilterState.intervalFilter) {
    productFilterStore.intervalFilter = savedFilterState.intervalFilter;
  }
  if (savedFilterState.colorFilter) {
    productFilterStore.colorFilter = savedFilterState.colorFilter;
  }
  if (savedFilterState.sizeFilter) {
    productFilterStore.sizeFilter = savedFilterState.sizeFilter;
  }
  if (savedFilterState.typeFilter) {
    productFilterStore.typeFilter = savedFilterState.typeFilter;
  }
  if (savedFilterState.keyWordFilter) {
    productFilterStore.keywordFilter = savedFilterState.keyWordFilter;
  }
  if(savedFilterState.saleFilter){
    productFilterStore.isSale=savedFilterState.saleFilter
  }
  
});

//捲動視窗到最上
function scrollToTop() {
   productFilterStore.filterScrollToTop()
}

//篩選後關閉篩選器
function sortChanged(){
    productFilterStore.resetLoad();
    if(window.innerWidth>=767){
        scrollToTop()
    }
    
}

function intervalChanged(){
    productFilterStore.resetLoad();
    if(window.innerWidth>=767){
        scrollToTop()
    }
    
}

function colorChanged() {
    productFilterStore.resetLoad();
    if(window.innerWidth>=767){
        scrollToTop()
    }
    
}

function searchKeyWord() {
  productFilterStore.resetLoad();
  if(window.innerWidth>=767){
    scrollToTop()
  }
  
}

function selectSize(size: string) {
    const index = productFilterStore.sizeFilter.indexOf(size)
    if (index === -1) {
        productFilterStore.sizeFilter.push(size)
    } else {
        productFilterStore.sizeFilter.splice(index, 1)
    }
    if(window.innerWidth>=767){
        scrollToTop()
    }
    
}
function selectType(type: string) {
    productFilterStore.clearFilterWithoutType()
    productFilterStore.typeFilter = type
    productFilterStore.resetLoad()
    if(window.innerWidth>=767){
        scrollToTop()
    }
    
}
function selectSale(type: string) {
    productFilterStore.clearFilterWithoutType()
    productFilterStore.typeFilter = type
    productFilterStore.isSale = true
    productFilterStore.resetLoad()
    if(window.innerWidth>=767){
        scrollToTop()
    }
    
}


//移除所有篩選
function cancleAllFilter() {
    productFilterStore.sortFilter = "original" 
    productFilterStore.intervalFilter = [0, 10000]
    productFilterStore.colorFilter = []
    productFilterStore.sizeFilter = []
    productFilterStore.keywordFilter=""
    productFilterStore.typeFilter = undefined
    productFilterStore.isSale=false
    productFilterStore.filterOpen = false;
}

</script>

<style scoped>
.main-filter {
    flex: none;
    width: 350px;
    height: 100%;
    background-color: white;
    padding: 0 10px;
    box-sizing: border-box;
}

.cancle {
    padding: 5px 15px;
    font-size: 20px;
    border: 1px solid black;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cancle:hover {
    cursor: pointer;
    color: white;
    background-color: black
}

.collapse {
    width: 100%;
    margin-top: 20px
}

::v-deep .el-collapse-item__header {
    font-weight: bold;
    font-size: 16px;
}
i{
    cursor: pointer;
}
.sort {
    font-size: 16px;
}

.sort:hover {
    cursor: pointer;
}

.interval {
    padding: 0 15px;
}

.el-collapse-item__wrap {
    overflow: visible;
}

.interavl-infos {
    display: flex;
    justify-content: space-between;
}

.interval-info {
    background-color: rgb(240, 240, 240);
    font-weight: bold;
    padding: 3px 5px;
}


.colors {
    display: flex;
    flex-wrap: wrap;
}

.color {
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-right: 20px
}

.color:hover {
    cursor: pointer
}

.spot {
    width: 10px;
    height: 10px;
    border-radius: 10px;
    border: 1px solid black;
    margin: 3px 5px;
}

.sizes {
    display: flex;
    flex-wrap: wrap;
}

.size {
    width: 70px;
    height: 30px;
    border: 1px solid black;
    margin: 10px 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}

.size:hover {
    cursor: pointer;
}

.size.select {
    border: 3px solid black;
}

.type {
    padding-left: 30px;
    font-size: 14px;
    margin-bottom: 3px;
}

.type:hover {
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
}
@media screen and (max-width:1024px){
    .main-filter{
        width: 250px;
    }
}
@media screen and (max-width:766px){
    .main-filter{
        width: 100%;
        height: 100%;
        background-color: white;
        padding: 30px;
        box-sizing: border-box;
    }
    
    .cancle{
        font-size: 18px;
    }
    
}
</style>
<style>
.typeCollapse .el-collapse-item__header {
    font-size: 14px;
    padding-left: 15px;
}
</style>
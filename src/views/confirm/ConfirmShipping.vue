<template>
    <div class="container">
        <div class="title">結帳</div>
        <div class="info-container" :class="{ active: !emailValid }">
            <div class="info">E-mail</div>
            <div class="info">請輸入電子信箱已繼續結帳</div>
            <div class="remind">該信箱將會收到訂單狀態更新</div>
            <div class="email-input">
                <el-input type="text" v-model="email" placeholder="電子信箱" @keydown.enter="checkEmail"/>
                <div class="button" @click="checkEmail">繼續</div>
            </div>
            <div class="warning" v-show="showWarning">請輸入正確的格式</div>
        </div>
        <div class="sub-title">配送方式</div>
        <div class="info-container" :class="{ active: emailValid }">
            <div class="shippings">
                <div class="shipping">
                    <input type="radio" v-model="shipping" name="shipping" id="宅配" value="宅配" :disabled="!emailValid">
                    <label for="宅配">宅配</label>
                </div>
                <div class="price">TWD 150</div>
            </div>
            <div class="shippings">
                <div class="shipping">
                    <input type="radio" v-model="shipping" name="shipping" id="到店自取" value="到店自取" :disabled="!emailValid">
                    <label for="到店自取">到店自取</label>
                </div>
                <div class="price">TWD 0</div>
            </div>
        </div>
        <div class="sub-title">配送資料</div>
        <div class="info-container" :class="{ active: emailValid }">
            <div class="info">個人資料</div>
            <div class="input">
                <el-input type="text" v-model="firstName" placeholder="姓氏" :disabled="!emailValid" />
                <div class="error" v-show="!firstNameValid">此為必填項目</div>
            </div>
            <div class="input">
                <el-input type="text" v-model="lastName" placeholder="名字" :disabled="!emailValid" />
                <div class="error" v-show="!lastNameValid">此為必填項目</div>
            </div>
            <div class="info">聯絡資訊</div>
            <div class="input">
                <el-input type="tel" v-model="phone" placeholder="電話號碼" :disabled="!emailValid" />
                <div class="error" v-show="!phoneValid">此為必填項目</div>
            </div>
            <div class="info" v-if="shipping=='宅配'">配送地址</div>
            <div class="input" v-if="shipping=='宅配'">
                <div class="address">
                    <el-select v-model="country" :disabled="!emailValid" placeholder="縣市">
                        <el-option v-for="(country, index) in countrys" :key="index"
                            :value="country">{{ country }}</el-option>
                    </el-select>
                    <el-select v-model="district" :disabled="!emailValid || !country" placeholder="鄉鎮市區">
                        <el-option v-for="(district, index) in districts" :key="index"
                            :value="district">{{ district }}</el-option>
                    </el-select>
                </div>
                <div class="error" v-show="!countryValid || !districtValid">此為必填項目</div>
            </div>
            <div class="input" v-if="shipping=='宅配'">
                <el-input type="text" v-model="address" placeholder="地址" :disabled="!emailValid" />
                <div class="error" v-show="!addressValid">此為必填項目</div>
            </div>
        </div>
        <div class="pay" @click="toPayment">下一步 : 付款</div>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch,watchEffect,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useShoppingCartStore } from '@/stores/shoppingCart';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase.js"

//firestore
const auth = getAuth()
const currentUser = ref()
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser.value = user
        getUserData(user);
    }
});

const userData=ref()
const getUserData = async (user: any) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            userData.value = userDoc.data();
        }
    }
};

onMounted(() => {
    if (currentUser.value) {
        getUserData(currentUser.value);
    }
});

//檢查email
const showWarning = ref(false);
const emailValid = ref(false);
const email = ref("")
function checkEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    showWarning.value = !emailRegex.test(email.value);
    if (!showWarning.value) {
        emailValid.value = true;
    } else {
        emailValid.value = false;
    }
}

//表單
const shipping = ref()
const firstName = ref()
const lastName = ref()
const phone = ref()
const country = ref()
const district = ref()
const address = ref()
const firstNameValid = ref(true)
const lastNameValid = ref(true)
const phoneValid = ref(true)
const countryValid = ref(true)
const districtValid = ref(true)
const addressValid = ref(true)

const shoppingCartStore=useShoppingCartStore()
watchEffect(()=>{
    shipping.value=shoppingCartStore.shippingWay
})

watch(shipping,((newValue)=>{
    shoppingCartStore.shippingWay=newValue
}))
watch(userData,((newValue)=>{
    firstName.value=newValue.firstName
    lastName.value=newValue.lastName
    phone.value=newValue.phone
    email.value=newValue.email
    country.value=newValue.country
    district.value=newValue.district
    address.value=newValue.address

}))
//地址
const districts = ref<string[]>([]);
const allDistricts: Record<string, string[]> = {
    '基隆市': ['仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'],
    '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
    '新北市': ['萬里區', '金山區', '板橋區', '汐止區', '深坑區', '石碇區', '瑞芳區', '平溪區', '雙溪區', '貢寮區', '新店區', '坪林區', '烏來區', '永和區', '中和區', '土城區', '三峽區', '樹林區', '鶯歌區', '三重區', '新莊區', '泰山區', '林口區', '蘆洲區', '五股區', '八里區', '淡水區', '三芝區', '石門區'],
    '桃園市': ['中壢區', '平鎮區', '龍潭區', '楊梅區', '新屋區', '觀音區', '桃園區', '龜山區', '八德區', '大溪區', '復興區', '大園區', '蘆竹區'],
    '新竹市': ['東區', '北區', '香山區'],
    '新竹縣': ['竹北市', '湖口鄉', '新豐鄉', '新埔鎮', '關西鎮', '芎林鄉', '寶山鄉', '竹東鎮', '五峰鄉', '橫山鄉', '尖石鄉', '北埔鄉', '峨眉鄉'],
    '苗栗縣': ['竹南鎮', '頭份市', '三灣鄉', '南庄鄉', '獅潭鄉', '後龍鎮', '通霄鎮', '苑裡鎮', '苗栗市', '造橋鄉', '頭屋鄉', '公館鄉', '大湖鄉', '泰安鄉', '銅鑼鄉', '三義鄉', '西湖鄉', '卓蘭鎮'],
    '台中市': ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '石岡區', '東勢區', '和平區', '新社區', '潭子區', '大雅區', '神岡區', '大肚區', '沙鹿區', '龍井區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'],
    '彰化縣': ['彰化市', '芬園鄉', '花壇鄉', '秀水鄉', '鹿港鎮', '福興鄉', '線西鄉', '和美鎮', '伸港鄉', '員林市', '社頭鄉', '永靖鄉', '埔心鄉', '溪湖鎮', '大村鄉', '埔鹽鄉', '田中鎮', '北斗鎮', '田尾鄉', '埤頭鄉', '溪州鄉', '竹塘鄉', '二林鎮', '大城鄉', '芳苑鄉', '二水鄉'],
    '南投縣': ['南投市', '中寮鄉', '草屯鎮', '國姓鄉', '埔里鎮', '仁愛鄉', '名間鄉', '集集鎮', '水里鄉', '魚池鄉', '信義鄉', '竹山鎮', '鹿谷鄉'],
    '雲林縣': ['斗南鎮', '大埤鄉', '虎尾鎮', '土庫鎮', '褒忠鄉', '東勢鄉', '台西鄉', '崙背鄉', '麥寮鄉', '斗六市', '林內鄉', '古坑鄉', '莿桐鄉', '西螺鎮', '二崙鄉', '北港鎮', '水林鄉', '口湖鄉', '四湖鄉', '元長鄉'],
    '嘉義市': ['東區', '西區'],
    '嘉義縣': ['番路鄉', '梅山鄉', '竹崎鄉', '阿里山鄉', '中埔鄉', '大埔鄉', '水上鄉', '鹿草鄉', '太保市', '朴子市', '東石鄉', '六腳鄉', '新港鄉', '民雄鄉', '大林鎮', '溪口鄉', '義竹鄉', '布袋鎮'],
    '台南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'],
    '高雄市': ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區', '仁武區', '大社區', '岡山區', '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區', '湖內區', '鳳山區', '大寮區', '林園區', '鳥松區', '大樹區', '旗山區', '美濃區', '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區', '茂林區', '茄萣區'],
    '屏東縣': ['屏東市', '三地門鄉', '霧台鄉', '瑪家鄉', '九如鄉', '里港鄉', '高樹鄉', '鹽埔鄉', '長治鄉', '麟洛鄉', '竹田鄉', '內埔鄉', '萬丹鄉', '潮州鎮', '泰武鄉', '來義鄉', '萬巒鄉', '崁頂鄉', '新埤鄉', '南州鄉', '林邊鄉', '東港鎮', '琉球鄉', '佳冬鄉', '新園鄉', '枋寮鄉', '枋山鄉', '春日鄉', '獅子鄉', '車城鄉', '牡丹鄉', '恆春鎮', '滿州鄉'],
    '澎湖縣': ['馬公市', '西嶼鄉', '望安鄉', '七美鄉', '白沙鄉', '湖西鄉'],
    '宜蘭縣': ['宜蘭市', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '羅東鎮', '三星鄉', '大同鄉', '五結鄉', '冬山鄉', '蘇澳鎮', '南澳鄉', '釣魚台'],
    '花蓮縣': ['花蓮市', '新城鄉', '秀林鄉', '吉安鄉', '壽豐鄉', '鳳林鎮', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '玉里鎮', '卓溪鄉', '富里鄉'],
    '台東縣': ['台東市', '綠島鄉', '蘭嶼鄉', '延平鄉', '卑南鄉', '鹿野鄉', '關山鎮', '海端鄉', '池上鄉', '東河鄉', '成功鎮', '長濱鄉', '太麻里鄉', '金峰鄉', '大武鄉', '達仁鄉'],
    '金門縣': ['金沙鎮', '金湖鎮', '金寧鄉', '金城鎮', '烈嶼鄉', '烏坵鄉'],
};

const countrys = ref([
    '基隆市', '台北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '台中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '台南市', '高雄市', '屏東縣', '澎湖縣', '宜蘭縣', '花蓮縣', '台東縣', '金門縣',
]);

watch(country, (newValue) => {
    districts.value = allDistricts[newValue] || [];
});

//路由&傳遞參數
const router = useRouter()
function toPayment() {
    emailValid.value = !!email.value;
    firstNameValid.value = !!firstName.value;
    lastNameValid.value = !!lastName.value;
    phoneValid.value = !!phone.value;
    countryValid.value = !!country.value;
    districtValid.value = !!district.value;
    addressValid.value = !!address.value;
    if(emailValid.value){
        if(shipping.value=='宅配'){
        if (emailValid.value && firstNameValid.value && lastNameValid.value && phoneValid.value && countryValid.value && districtValid.value && addressValid.value) {
        router.push({
            path: '/confirm/payment',
            query: {
                    email:email.value,
                    firstName: firstName.value,
                    lastName: lastName.value,
                    phone: phone.value,
                    country: country.value,
                    district: district.value,
                    address: address.value,
                    shipping:shipping.value
                }
        })
    } else {
        ElMessage({
            message: '請輸入完整資訊',
            type: 'warning',
            plain: true,
        })
    }
    }else{
        if (emailValid.value && firstNameValid.value && lastNameValid.value && phoneValid.value) {
        router.push({
            path: '/confirm/payment',
            query: {
                    email:email.value,
                    firstName: firstName.value,
                    lastName: lastName.value,
                    phone: phone.value,
                    shipping:shipping.value

                }
        })
    } else {
        ElMessage({
            message: '請輸入完整資訊',
            type: 'warning',
            plain: true,
        })
    }
    }
    }else{
        ElMessage({
            message: '請先確認Email',
            type: 'warning',
            plain: true,
        })
    }
    
   
}
</script>

<style scoped>
.container {
    width: 50%;
    box-sizing: border-box;
    padding-right: 25px
}

.title {
    font-size: 30px;
    font-weight: bold;
}

.info-container {
    padding: 20px;
    border: 1px solid black;
    margin: 20px 0;
    box-sizing: border-box
}

.info-container.active {
    border: 3px solid black;
}

.info {
    font-size: 18px;
    margin-bottom: 10px
}

.remind {
    font-size: 14px;
    margin-bottom: 5px
}

.shippings {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px
}

.shipping {
    display: flex;
    font-size: 18px;
}

.email-input {
    display: flex;
}

.button {
    width: 150px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    background-color: black;
    color: white;
    margin-left: 20px
}

.button:hover {
    cursor: pointer;
}

.warning {
    color: red;
    font-size: 16px;
    margin-top: 5px;
}

.sub-title {
    font-size: 25px;
    font-weight: bold;
}

.input {
    display: flex;
    flex-direction: column;
}

.el-input {
    width: 100%;
    height: 35px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

.address {
    display: flex;
}


.el-select {
    width: 100%;
    height: 35px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

.el-select:first-child {
    margin-right: 20px;
}

option {
    height: 30px;
}

.error {
    color: red;
    font-size: 16px;
    margin-bottom: 5px
}

.pay {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    background-color: black;
    color: white;
}

.pay:hover {
    cursor: pointer;
}
@media screen and (max-width:767px){
    .container{
        width: 100%;
        order: 1;
        padding-right: 0;
    }
    .title{
        font-size: 25px;
    }
}
@media screen and (max-width:414px){
    .info{
        font-size: 16px;
    }
    .remind{
        font-size: 12px;
    }
    .email-input{
        flex-wrap: wrap;
    }
    .email-input .el-input{
        width: 300px;
    }
    .button{
        margin-left: 0;
        height: 30px;
        font-size: 16px;
    }
    .shipping{
        font-size: 16px
    }
}
</style>

<template>
    <div class="member">
        <div class="welcome">{{ currentUser?.displayName }}，歡迎回來</div>
        <div class="infos-container">
            <div class="left">
                <div class="block">
                    <div class="top">
                        <div class="title">我的資料</div>
                        <div class="more-container">
                            <div class="more" v-if="!userEdit" @click="editUserInfo">更改</div>
                            <div class="more" v-if="userEdit" @click="cancleEditUser">取消</div>
                        </div>
                    </div>
                    <div class="bottom" v-if="userData">
                        <div class="infos">
                            <div class="info">名字<span>{{ userData.userName }}</span></div>
                            <div class="change" v-if="userEdit" @click="saveNameChange">儲存</div>
                        </div>
                        <div class="names" v-if="userEdit">
                            <el-input v-model="firstName" placeholder="姓氏"></el-input>
                            <el-input v-model="lastName" placeholder="名字"></el-input>
                        </div>
                        <div class="infos">
                            <div class="info">信箱<span>{{ userData.email }}</span></div>
                            <div class="remind" v-if="!sameEmail">尚未驗證</div>
                            <div class="change" v-if="userEdit" @click="saveEmailChange">儲存</div>
                        </div>
                        <el-input v-model="email" placeholder="信箱" v-if="userEdit"></el-input>
                        <el-input v-model="password" placeholder="請輸入密碼已進行驗證" show-password v-if="userEdit"></el-input>
                        <div class="infos">
                            <div class="info">電話號碼<span>{{ userData.phone }}</span></div>
                            <div class="change" v-if="userEdit" @click="savePhoneChange">儲存</div>
                        </div>
                        <el-input v-model="phone" placeholder="電話號碼" v-if="userEdit"></el-input>

                    </div>
                </div>
                <div class="block">
                    <div class="title">寄件地址</div>
                    <div class="buttons">
                        <div class="button" v-if="!addressOpen" @click="addAddress">新增地址</div>
                        <div class="button" v-if="addressOpen" @click="cancleAddress">取消</div>
                        <div class="button" v-if="addressOpen" @click="confirmAddress">確認地址</div>
                    </div>
                    <div class="input" v-if="addressOpen">
                        <div class="address">
                            <el-select v-model="country" placeholder="縣市">
                                <el-option v-for="(country, index) in countrys" :key="index" :value="country">{{ country
                                    }}</el-option>
                            </el-select>
                            <el-select v-model="district" placeholder="鄉鎮市區" :disabled="!country">
                                <el-option v-for="(district, index) in districts" :key="index" :value="district">{{
                                    district }}</el-option>
                            </el-select>
                        </div>
                        <div class="error" v-show="!countryValid || !districtValid">此為必填項目</div>
                    </div>
                    <div class="input" v-if="addressOpen">
                        <el-input type="text" v-model="address" placeholder="地址" />
                        <div class="error" v-show="!addressValid">此為必填項目</div>
                    </div>
                    <div class="info" v-if="userData.address">地址<span>{{ userData.country }} {{ userData.district }} {{
                        userData.address }}</span></div>

                </div>
            </div>
            <div class="right">
                <div class="block">
                    <div class="title">訂單紀錄</div>
                    <div class="empty" v-if="!sortedOrders.length">查無訂單記錄</div>
                    <div class="order" v-for="order in sortedOrders" :key="order.id">
                        <el-collapse>
                            <el-collapse-item>
                                <template #title>
                                    <div class="orderTitle">
                                        <div class="orderID">{{ order.id }}</div>
                                        <div class="orderTime">{{ order.time }}</div>
                                    </div>
                                </template>
                                <div class="orderProduct" v-for="(product, index) in order.order" :key="index">
                                    <div class="pic">
                                        <img :src="product.img">
                                    </div>
                                    <div class="content">
                                        <div class="name">{{ product.name }}</div>
                                        <div class="details">
                                            <div class="detail">顏色 : {{ product.color }}</div>
                                            <div class="detail">尺寸 : {{ product.size }}</div>
                                        </div>
                                        <div class="prices">
                                            <div class="price">TWD{{ formattedPrice(product.price) }}</div>
                                            <div class="quantity">x{{ product.quantity }}</div>
                                            <div class="total">TWD{{ formattedPrice(getTotalPrice(product)) }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="totalContainer">
                                    <div class="cancle" @click="cancleOrder(order)"><i
                                            class="fa-solid fa-trash-can"></i>取消訂單</div>
                                    <div class="totalPrice">總價 : {{ order.total }}</div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { getAuth, onAuthStateChanged, updateProfile,EmailAuthProvider,verifyBeforeUpdateEmail,reauthenticateWithCredential,signOut } from "firebase/auth";
import { getDoc, doc, collection, getDocs, deleteDoc, writeBatch, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase.js";
import { ElMessage,ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router=useRouter()
//firestore
const auth = getAuth();
const currentUser = ref()
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser.value = user
        getUserData(user);
        getUserOrders(user)
    }
});
const userData = ref()
const userOrders = ref()

const getUserData = async (user: any) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            userData.value = userDoc.data();
        }
    }
};

const getUserOrders = async (user: any) => {
    if (user) {
        const ordersCollection = collection(db, 'users', user.uid, 'orders');
        const orderSnapshot = await getDocs(ordersCollection);
        userOrders.value = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};

// 對訂單進行排序
const sortedOrders = ref();

function sortOrders(orders: any) {
    return [...orders].sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
}

watch(userOrders, (newOrders) => {
    sortedOrders.value = sortOrders(newOrders);
});


onMounted(() => {
    if (currentUser.value) {
        getUserData(currentUser.value);
        getUserOrders(currentUser.value)
    }
});

//給金額的千位加上頓號
function formattedPrice(price: number) {
    return price.toLocaleString()
}

//計算價錢
function getTotalPrice(product: any) {
    let totalPriceForProduct = 0;

    const discountBundles = Math.floor(product.quantity / 3); // 可以享受 8 折的组数
    const nonDiscountQuantity = product.quantity % 3; // 不享受折扣的商品数量

    totalPriceForProduct += discountBundles * 3 * product.price * 0.8;
    totalPriceForProduct += nonDiscountQuantity * product.price;

    return totalPriceForProduct;
}

//修改size的形式
function getProductSize(item: any): string {
    switch (item.size) {
        case '32A':
            return 'size32A';
        case '32B':
            return 'size32B';
        case '32C':
            return 'size32C';
        case '32D':
            return 'size32D';
        case '34A':
            return 'size34A';
        case '34B':
            return 'size34B';
        case '34C':
            return 'size34C';
        case '34D':
            return 'size34D';
        case '36A':
            return 'size36A';
        case '36B':
            return 'size36B';
        case '36C':
            return 'size36C';
        case '36D':
            return 'size36D';
        case '24':
            return 'size24';
        case '25':
            return 'size25';
        case '26':
            return 'size26';
        default:
            return item.size;
    }
}

//取消訂單
async function cancleOrder(orderData: any) {
    if (currentUser.value) {
        const orderDocRef = doc(db, "users", currentUser.value.uid, "orders", orderData.id);

        // 刪除訂單
        await deleteDoc(orderDocRef);

        // 更新庫存
        const batch = writeBatch(db);
        for (const product of orderData.order) {
            const collectionName = product.category === 'man' ? 'manClothes' : product.category === 'woman' ? 'womanClothes' : 'accessory';
            const productRef = doc(db, collectionName, product.id);
            const productDoc = await getDoc(productRef);
            if (productDoc.exists()) {
                const currentStock = productDoc.data();
                if (currentStock[getProductSize(product)] !== undefined) {
                    const newStock = currentStock[getProductSize(product)] + product.quantity;
                    batch.update(productRef, {
                        [getProductSize(product)]: newStock
                    });
                }
            }
        }

        await batch.commit();

        // 重新獲取訂單數據
        getUserOrders(currentUser.value);
    }
}

//個人資料
const firstName = ref()
const lastName = ref()
const fullName = computed(() => {
    return firstName.value + lastName.value
})
const email = ref()
const phone = ref()
const password=ref()
const userEdit = ref(false)
const sameEmail=ref(true)

function checkEmail(){
    if(userData.value.email==currentUser.value.email){
        sameEmail.value=true
    }else{
        sameEmail.value=false
    }
}

watch(userData, ((data) => {
    firstName.value = data.firstName
    lastName.value = data.lastName
    email.value = data.email
    phone.value = data.phone
    checkEmail()

}))

function editUserInfo() {
    userEdit.value = true
}

function cancleEditUser() {
    userEdit.value = false
}

function saveNameChange() {
    updateProfile(currentUser.value, {
        displayName: fullName.value
    }).then(() => {
        updateDoc(doc(db, "users", currentUser.value.uid), {
            firstName: firstName.value,
            lastName: lastName.value,
            userName: fullName.value,
        });
        ElMessage({
            message: "姓名更新成功",
            type: "success",
        });
        getUserData(currentUser.value)
    }).catch((error) => {
        console.log(error)
    });
}

async function savePhoneChange(){
    await updateDoc(doc(db, "users", currentUser.value.uid), {
            phone:phone.value
        });
        ElMessage({
            message: "電話號碼更新成功",
            type: "success",
        });
        getUserData(currentUser.value)
}

async function saveEmailChange(){
    if (currentUser.value) {
    if (email.value === userData.value.email) {
      ElMessageBox.alert("新信箱不得與舊信箱相同", "提示", {
        confirmButtonText: "確認",
      });
    } else {
      //用email和舊密碼作為認證
      const credential = EmailAuthProvider.credential(
        currentUser.value.email,
        password.value
      );
      try {
        await reauthenticateWithCredential(currentUser.value, credential);
        await verifyBeforeUpdateEmail(currentUser.value, email.value);
        ElMessageBox.alert("驗證信已成功發送，請查看您的新信箱", "提示", {
          confirmButtonText: "確認",
        })
          .then(() => {
            updateDoc(doc(db, "users", currentUser.value.uid), {
            email:email.value
        });
        ElMessageBox.alert("請在驗證新信箱後再重新登入", "提示", {
          confirmButtonText: "確認",
        }).then(()=>{
            signOut(auth)
            router.push({
                path:'/login'
            })
        })
          })
          .catch(() => {});
      } catch (error:any) {
        console.error("驗證信發送失敗", error);
        if (error.code === "auth/missing-password") {
          ElMessageBox.alert("密碼不得為空", "提示", {
            confirmButtonText: "確認",
          });
        }
        if (error.code === "auth/invalid-credential") {
          ElMessageBox.alert("密碼錯誤", "提示", {
            confirmButtonText: "確認",
          });
        }
        if (error.code === "auth/missing-new-email") {
          ElMessageBox.alert("信箱不得為空", "提示", {
            confirmButtonText: "確認",
          });
        }
        if (error.code === "auth/invalid-new-email") {
          ElMessageBox.alert("信箱格式錯誤", "提示", {
            confirmButtonText: "確認",
          });
        }
      }
    }
  }
}
//地址
const country = ref()
const district = ref()
const address = ref()
const countryValid = ref(true)
const districtValid = ref(true)
const addressValid = ref(true)
const addressOpen = ref(false)

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

function addAddress() {
    addressOpen.value = true
}

function cancleAddress() {
    addressOpen.value = false
}

async function confirmAddress() {
    countryValid.value = !!country.value;
    districtValid.value = !!district.value;
    addressValid.value = !!address.value;
    if (countryValid.value && districtValid.value && addressValid.value) {
        await updateDoc(doc(db, "users", currentUser.value.uid), {
            country: country.value,
            district: district.value,
            address: address.value
        });
        ElMessage({
            message: "地址新增成功",
            type: "success",
        });
        getUserData(currentUser.value)
        addressOpen.value = false
    } else {
        ElMessage({
            message: "請輸入完整資訊",
            type: "error",
        });
    }
}
</script>
<style scoped>
.member {
    padding: 30px 50px;
}

.welcome {
    font-size: 35px;
    font-weight: bold;
}

.infos-container {
    display: flex;
}

.left {
    width: 50%;
    padding: 20px;
}

.right {
    width: 50%;
    padding: 20px;
}

.block {
    background-color: rgba(200, 200, 200, 0.5);
    padding: 10px 20px;
    margin-bottom: 25px;
}

.top {
    display: flex;
    justify-content: space-between
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
}
.infos{
    display: flex;
    flex-wrap: wrap
}
.info {
    font-size: 18px;
    margin-bottom: 5px;
    font-weight: 600;
}

.info span {
    margin-left: 10px;
    color: rgb(100, 100, 100);
    margin-right: 15px;
}
.change{
    font-size: 18px;
    font-weight: bold;
}
.change:hover{
    cursor:pointer
}
.remind{
    color: red;
    margin-left: 15px;
}
.names {
    display: flex;
}

.names .el-input:first-child {
    margin-right: 20px
}

.el-input {
    margin: 10px 0;
}

.input {
    margin-bottom: 15px;
}

.address {
    display: flex;
}

.error {
    color: red;
}

.el-select:first-child {
    margin-right: 20px;
}

.buttons {
    display: flex;
    margin-bottom: 20px;
}

.button {
    border: 1px solid black;
    width: 100px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px
}

.button:hover {
    background-color: black;
    color: white;
    cursor: pointer;
}

.more-container {
    display: flex;
}

.more {
    margin-left: 10px
}

.more:hover {
    cursor: pointer;
    font-weight: bold;
}

.el-collapse {
    --el-collapse-header-bg-color: transparent;
    --el-collapse-content-bg-color: transparent;
    border-bottom: unset;
    border-top: unset;
    --el-collapse-border-color: rgba(40, 40, 40, 0.8);
}

.orderTitle {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 16px;
}

.orderTime {
    font-size: 14px;
}

.orderProduct {
    display: flex;
    font-size: 16px;
}

.pic {
    width: 20%;
}

img {
    width: 100%
}

.prices {
    display: flex;
    justify-content: space-between
}

.content {
    width: 80%;
    padding: 10px 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.name {
    font-weight: bold;
}

.details {
    display: flex;
    flex-direction: column;
}

.totalContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
}

i {
    margin-right: 5px
}

.cancle:hover {
    cursor: pointer;
}
@media screen and (max-width:1024px){
    .member{
        padding: 30px 15px;
    }
    .welcome{
        font-size: 30px;
    }
    .infos-container{
        flex-direction: column;
    }
    .left,.right{
        width: 100%;
        box-sizing: border-box;
        padding: 10px 15px;
    }
}
@media screen and (max-width:767px){
    .member{
        padding: 20px 5px;
    }
    .welcome{
        font-size: 25px;
    }
    .info,.change{
        font-size: 14px
    }
    .el-input{
        margin: 5px 0
    }
    .button{
        height: 30px
    }
    .orderTitle{
        flex-wrap: wrap;
        padding:5px 0 ;
    }
    .el-collapse{
        --el-collapse-header-height:unset;
        padding-bottom: 15px;
    }
    .detail,.quantity,.price,.total{
        font-size: 14px
    }
    .content{
        padding: 0 5px 10px 5px ;
    }
    .pic{
        width: 25%;
    }
    .cancle,.totalPrice{
        font-size: 16px;
    }
@media screen and (max-width:414px){
    .button{
        height: 25px;
        width: 80px;
        font-size: 14px;
    }
    .el-input,.el-select{
        height: 30px
    }
    .block{
        padding: 10px;
    }
}
    
}
</style>
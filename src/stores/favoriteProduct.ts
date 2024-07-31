import { defineStore } from 'pinia';
import { ref ,watch,onMounted} from 'vue';
import { ElMessage } from 'element-plus';

interface Product {
    name: string,
    img: string,
    img2:string,
    availableColors:Array<string>,
    color: string,
    price: number,
    favorite: boolean,
    confirmSize:string,
    id:number
}
export const useFavoriteProductStore = defineStore('favoriteProduct', () => {
    //商品列表
    const favoriteItems = ref<Product[]>([])

    //從localstorage加載
    const loadFavoriteItems = () => {
        const storedItems = localStorage.getItem('favoriteItems');
        if (storedItems) {
            favoriteItems.value = JSON.parse(storedItems);
        }
    };
    onMounted(()=>{
        loadFavoriteItems();
    })
    
    watch(favoriteItems, (newItems) => {
        localStorage.setItem('favoriteItems', JSON.stringify(newItems));
    }, { deep: true });

    //切換收藏狀態
    function toggleFavorite(product: Product) {
        const existingItem = favoriteItems.value.find(item =>
            item.id === product.id);
        if (existingItem) {
            favoriteItems.value = favoriteItems.value.filter(item =>
                !(item.id === product.id)
            );
            ElMessage({
                message: '商品已從願望清單移除',
                type: 'error',
                plain: true,
            });
        } else {
            favoriteItems.value.push({ ...product });
            ElMessage({
                message: '商品成功新增至願望清單',
                type: 'success',
                plain: true,
            })
        }
    }

    //更新確認的尺寸
    function updateConfirmSize(productID: number, confirmSize: string){
        const product = favoriteItems.value.find((item: any) => item.id === productID);
        if (product) {
            product.confirmSize = confirmSize;
        }
    }
   
    return {
        favoriteItems,
        toggleFavorite,
        updateConfirmSize
    }
})
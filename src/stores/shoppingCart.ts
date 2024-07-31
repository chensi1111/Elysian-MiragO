import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useProductsInfoStore } from './productsInfo';


interface Product {
    name: string,
    img: string,
    img2: string,
    price: number,
    quantity: number,
    color: string,
    size: string,
    stock: number,
    sale: boolean,
    availableColors: Array<string>,
    sizeXS?: number | null,
    sizeS?: number | null,
    sizeM?: number | null,
    sizeL?: number | null,
    sizeXL?: number | null,
    onesize?: number | null,
    size25?: number | null,
    size26?: number | null,
    size24?: number | null,
    size32A?: number | null,
    size32B?: number | null,
    size32C?: number | null,
    size32D?: number | null,
    size34A?: number | null,
    size34B?: number | null,
    size34C?: number | null,
    size34D?: number | null,
    size36A?: number | null,
    size36B?: number | null,
    size36C?: number | null,
    size36D?: number | null,
    favorite: boolean,
    id: number,
    type: string,
    category:string
}

export const useShoppingCartStore = defineStore('shoppingCart', () => {
    //購物車是否開啟
    const shoppingCartOpen = ref<boolean>(false);

    //商品
    const cartItems = ref<Product[]>([]);

    //運送方式
    const shippingWay = ref('宅配')

    //運費
    const shippingFee = computed(() => {
        if (shippingWay.value == '宅配') {
            if (totalQuantity.value > 4) {
                return 0
            } else {
                return 150
            }
        } else {
            return 0
        }

    })

    //關閉對話框
    const dialogOpen = ref<boolean>(false)
    const closeDialog = ref<boolean>(false)

    //打開購物車
    function openCart() {
        shoppingCartOpen.value = true;
    }

    //關閉購物車
    function closeCart() {
        shoppingCartOpen.value = false;
    }

    //關閉購物車的計時器
    const closeCartTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

    //清除購物車計時器
    function clearCloseCartTimeout() {
        if (closeCartTimeout.value) {
            clearTimeout(closeCartTimeout.value);
            closeCartTimeout.value = null;
        }
    }

    //添加商品數量
    function plusItem(productname: string, productsize: string, productColor: string) {
        const item = cartItems.value.find(item => item.name === productname && item.size === productsize && item.color === productColor);
        if (item) {
            if (item.quantity < item.stock) {
                item.quantity++;
            }
        }
    }
    //減少商品數量
    function minusItem(productname: string, productsize: string, productColor: string) {
        const item = cartItems.value.find(item => item.name === productname && item.size === productsize && item.color === productColor);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                removeItem(productname, productsize, productColor)
            }
        }
    }
    // 新增商品
    function addItem(product: Product) {
        const existingItem = cartItems.value.find(item =>
            item.name === product.name && item.size === product.size && item.color === product.color
        );
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
                ElMessage({
                    message: '商品成功新增至購物車',
                    type: 'success',
                    plain: true,
                })
            } else {
                ElMessage({
                    message: '已達到商品最大庫存，無法再添加。',
                    type: 'error',
                    plain: true,
                });
            }
        } else {
            cartItems.value.push({ ...product, quantity: 1 });
            ElMessage({
                message: '商品成功新增至購物車',
                type: 'success',
                plain: true,
            })
        }
    }


    // 刪除指定商品
    function removeItem(productname: string, productsize: string, productColor: string) {
        ElMessageBox.confirm(
            `確定要刪除${productname}嗎?`,
            'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        )
            .then(() => {
                cartItems.value = cartItems.value.filter(item => !(item.name === productname && item.size === productsize && item.color === productColor));
                ElMessage({
                    type: 'success',
                    message: '刪除成功',
                })
            })
            .catch(() => {
                ElMessage({
                    type: 'error',
                    message: '刪除失敗',
                })
            })

    }

    function cleanCartItems(){
        cartItems.value=[]
    }
    //移置喜愛列表
    function addFavorite(productname: string, productsize: string, productColor: string) {
        cartItems.value = cartItems.value.filter(item => !(item.name === productname && item.size === productsize && item.color === productColor));
    }

    //計算商品的總數量
    const totalQuantity = computed(() => {
        return cartItems.value.reduce((total, item) => total + (item.quantity || 0), 0);
    });

    //計算商品的總價格
    const totalPrice = computed(() => {
        return cartItems.value.reduce((total, item) => {
            let totalPriceForItem = 0;

            const discountQuantity = Math.floor(item.quantity / 3); //有折扣
            const nonDiscountQuantity = item.quantity % 3; //無折扣

            totalPriceForItem += discountQuantity * 3 * item.price * 0.8;
            totalPriceForItem += nonDiscountQuantity * item.price;

            return total + totalPriceForItem;
        }, 0);
    });

    //計算商品的原始總價格
    const totalOriginalPrice = computed(() => {
        return cartItems.value.reduce((total, item) => {
            let totalPriceForItem = 0;
            totalPriceForItem += item.price * item.quantity;

            return total + totalPriceForItem;
        }, 0);
    });

    //切換顏色
    function switchColor(productName: string, currentColor: string, currentSize: string, newColor: string): Product | null {
        const productInfoStore = useProductsInfoStore();
        const itemIndex = cartItems.value.findIndex(item => item.name === productName && item.color === currentColor && item.size === currentSize);

        if (itemIndex !== -1) {
            const currentItem = cartItems.value[itemIndex];

            // 新舊顏色相同，則直接返回
            if (currentColor === newColor) {
                ElMessage({
                    message: '所選顏色與當前相同',
                    type: 'info',
                    plain: true,
                });
                return currentItem;
            }

            const productList = currentItem.type === 'man' ? productInfoStore.manProductList : productInfoStore.womanProductList;
            const newProduct = productList.find(product => product.name === productName && product.color === newColor);

            if (newProduct) {
                let newStock: number | null = 0;
                const size = currentItem.size;

                // 根據尺寸尋找對應庫存
                switch (size) {
                    case 'XS':
                        newStock = newProduct.sizeXS ?? 0;
                        break;
                    case 'S':
                        newStock = newProduct.sizeS ?? 0;
                        break;
                    case 'M':
                        newStock = newProduct.sizeM ?? 0;
                        break;
                    case 'L':
                        newStock = newProduct.sizeL ?? 0;
                        break;
                    case 'XL':
                        newStock = newProduct.sizeXL ?? 0;
                        break;
                    case '25':
                        newStock = newProduct.size25 ?? 0;
                        break;
                    case '26':
                        newStock = newProduct.size26 ?? 0;
                        break;
                    case '24':
                        newStock = newProduct.size24 ?? 0;
                        break;
                    case '32A':
                        newStock = newProduct.size32A ?? 0;
                        break;
                    case '32B':
                        newStock = newProduct.size32B ?? 0;
                        break;
                    case '32C':
                        newStock = newProduct.size32C ?? 0;
                        break;
                    case '32D':
                        newStock = newProduct.size32D ?? 0;
                        break;
                    case '34A':
                        newStock = newProduct.size34A ?? 0;
                        break;
                    case '34B':
                        newStock = newProduct.size34B ?? 0;
                        break;
                    case '34C':
                        newStock = newProduct.size34C ?? 0;
                        break;
                    case '34D':
                        newStock = newProduct.size34D ?? 0;
                        break;
                    case '36A':
                        newStock = newProduct.size36A ?? 0;
                        break;
                    case '36B':
                        newStock = newProduct.size36B ?? 0;
                        break;
                    case '36C':
                        newStock = newProduct.size36C ?? 0;
                        break;
                    case '36D':
                        newStock = newProduct.size36D ?? 0;
                        break;
                    case 'onesize':
                        newStock = newProduct.onesize ?? 0;
                        break;
                    default:
                        newStock = 0;
                }

                const updatedProduct = {
                    ...newProduct,
                    quantity: currentItem.quantity,
                    size: currentItem.size,
                    stock: newStock
                };

                // 檢查是否有相同商品
                const existingItem = cartItems.value.find(item =>
                    item.name === productName && item.color === newColor && item.size === currentItem.size
                );

                if (existingItem) {

                    // 若與目標顏色相同則合併
                    existingItem.quantity += currentItem.quantity;
                    // 移除當前商品
                    cartItems.value = cartItems.value.filter(item => !(item.name === productName && item.color === currentColor && item.size === currentItem.size));
                    closeDialog.value = true
                } else {
                    cartItems.value[itemIndex] = updatedProduct;
                }

                ElMessage({
                    message: '商品颜色已切换成功。',
                    type: 'success',
                    plain: true,
                });
                return updatedProduct;
            } else {
                ElMessage({
                    message: '找不到新颜色的商品。',
                    type: 'error',
                    plain: true,
                });
                return null;
            }
        } else {
            ElMessage({
                message: '找不到当前颜色的商品。',
                type: 'error',
                plain: true,
            });
            return null;
        }
    }

    function switchSize(productName: string, productColor: string, currentSize: string, newSize: string): Product | null {
        const productInfoStore = useProductsInfoStore();
        const itemIndex = cartItems.value.findIndex(item => item.name === productName && item.color === productColor && item.size === currentSize);

        if (itemIndex !== -1) {
            const currentItem = cartItems.value[itemIndex];
            const productList = currentItem.type === 'man' ? productInfoStore.manProductList : productInfoStore.womanProductList;
            const newProduct = productList.find(product => product.name === productName && product.color === productColor);

            if (newProduct) {
                let newStock: number | null = 0;

                // 根據尺寸尋找對應庫存
                switch (newSize) {
                    case 'XS':
                        newStock = newProduct.sizeXS ?? 0;
                        break;
                    case 'S':
                        newStock = newProduct.sizeS ?? 0;
                        break;
                    case 'M':
                        newStock = newProduct.sizeM ?? 0;
                        break;
                    case 'L':
                        newStock = newProduct.sizeL ?? 0;
                        break;
                    case 'XL':
                        newStock = newProduct.sizeXL ?? 0;
                        break;
                    case '25':
                        newStock = newProduct.size25 ?? 0;
                        break;
                    case '26':
                        newStock = newProduct.size26 ?? 0;
                        break;
                    case '24':
                        newStock = newProduct.size24 ?? 0;
                        break;
                    case '32A':
                        newStock = newProduct.size32A ?? 0;
                        break;
                    case '32B':
                        newStock = newProduct.size32B ?? 0;
                        break;
                    case '32C':
                        newStock = newProduct.size32C ?? 0;
                        break;
                    case '32D':
                        newStock = newProduct.size32D ?? 0;
                        break;
                    case '34A':
                        newStock = newProduct.size34A ?? 0;
                        break;
                    case '34B':
                        newStock = newProduct.size34B ?? 0;
                        break;
                    case '34C':
                        newStock = newProduct.size34C ?? 0;
                        break;
                    case '34D':
                        newStock = newProduct.size34D ?? 0;
                        break;
                    case '36A':
                        newStock = newProduct.size36A ?? 0;
                        break;
                    case '36B':
                        newStock = newProduct.size36B ?? 0;
                        break;
                    case '36C':
                        newStock = newProduct.size36C ?? 0;
                        break;
                    case '36D':
                        newStock = newProduct.size36D ?? 0;
                        break;
                    case 'onesize':
                        newStock = newProduct.onesize ?? 0;
                        break;
                    default:
                        newStock = 0;
                }

                const updatedProduct = {
                    ...currentItem,
                    size: newSize,
                    stock: newStock
                };

                // 新舊尺寸相同則不變
                if (currentSize === newSize) {
                    cartItems.value[itemIndex] = updatedProduct;
                } else {
                    //檢查是否有相同商品
                    const existingItem = cartItems.value.find(item =>
                        item.name === productName && item.color === productColor && item.size === newSize
                    );

                    if (existingItem) {
                        // 若與目標尺寸相同則合併
                        existingItem.quantity += currentItem.quantity;
                        // 移除當前商品
                        cartItems.value = cartItems.value.filter(item => !(item.name === productName && item.color === productColor && item.size === currentSize));
                    } else {
                        cartItems.value[itemIndex] = updatedProduct;
                    }
                }

                ElMessage({
                    message: '商品尺寸已切换成功。',
                    type: 'success',
                    plain: true,
                });

                return updatedProduct;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    //localstorage
    function saveToLocalstorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems.value));
    }

    function loadFromLocalStorage() {
        const savedCartItems = localStorage.getItem('cartItems');
        const savedFavoriteStatus = localStorage.getItem('favoriteStatus')
        if (savedCartItems) {
            cartItems.value = JSON.parse(savedCartItems);
            if (savedFavoriteStatus) {
                const favoriteStatus = JSON.parse(savedFavoriteStatus)

                cartItems.value.forEach(item => {
                    if (favoriteStatus[item.id] !== undefined) {
                        item.favorite = favoriteStatus[item.id];
                    }
                });
            }
        }
    }

    watch(cartItems, () => {
        saveToLocalstorage();
    }, { deep: true });


    loadFromLocalStorage();

    return {
        shoppingCartOpen,
        cartItems,
        shippingWay,
        shippingFee,
        dialogOpen,
        closeDialog,
        openCart,
        closeCart,
        closeCartTimeout,
        clearCloseCartTimeout,
        addItem,
        plusItem,
        minusItem,
        removeItem,
        switchColor,
        switchSize,
        addFavorite,
        cleanCartItems,
        totalQuantity,
        totalPrice,
        totalOriginalPrice,
        loadFromLocalStorage
    };
});

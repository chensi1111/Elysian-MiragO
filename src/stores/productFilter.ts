import { ref } from "vue";
import { defineStore } from "pinia";

export const useProductFilterStore = defineStore('productFilter', () => {
    const filterOpen=ref(false)
    const sortFilter = ref()
    const intervalFilter = ref()
    const colorFilter = ref()
    const sizeFilter = ref()
    const typeFilter = ref()
    const keywordFilter=ref()
    const isSale = ref(false)

    const itemsToShow = ref(20);
    const loadMoreProducts = () => {
        itemsToShow.value += 20;
    }
    const resetLoad = () => {
        itemsToShow.value = 20
    }


    return { filterOpen,sortFilter, intervalFilter, colorFilter, sizeFilter, typeFilter, isSale, itemsToShow, loadMoreProducts, resetLoad ,keywordFilter}
})
import { ref } from "vue";
import { defineStore } from "pinia";

export const useProductFilterStore = defineStore("productFilter", () => {
  //篩選器開關
  const filterOpen = ref(false);

  //滾到至上
  const filterScrollToTop = () => {
    if (window.innerWidth < 767) {
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: 470 });
    }
  };

  //篩選器
  const sortFilter = ref("original");
  const intervalFilter = ref([0, 10000]);
  const colorFilter = ref([]);
  const sizeFilter = ref<string[]>([]);
  const typeFilter = ref();
  const keywordFilter = ref();
  const isSale = ref(false);

  const clearFilterWithoutType = () => {
    if (typeFilter.value) {
      intervalFilter.value = [0, 10000];
      colorFilter.value = [];
      sizeFilter.value = [];
      keywordFilter.value = undefined;
      isSale.value = false;
    }
  };
  //顯示商品數量
  const itemsToShow = ref(20);
  const loadMoreProducts = () => {
    itemsToShow.value += 20;
  };
  const resetLoad = () => {
    itemsToShow.value = 20;
  };

  return {
    filterOpen,
    filterScrollToTop,
    sortFilter,
    intervalFilter,
    colorFilter,
    sizeFilter,
    typeFilter,
    isSale,
    itemsToShow,
    loadMoreProducts,
    resetLoad,
    keywordFilter,
    clearFilterWithoutType,
  };
});

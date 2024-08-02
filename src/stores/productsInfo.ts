import { defineStore } from "pinia";
import { ref, onMounted, reactive, watch, nextTick, computed } from "vue";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Product {
  name: string;
  img: string;
  img2: string;
  availableColors: Array<string>;
  color: string;
  price: number;
  sizeXS?: number | null;
  sizeS?: number | null;
  sizeM?: number | null;
  sizeL?: number | null;
  sizeXL?: number | null;
  onesize?: number | null;
  size25?: number | null;
  size26?: number | null;
  size24?: number | null;
  size32A?: number | null;
  size32B?: number | null;
  size32C?: number | null;
  size32D?: number | null;
  size34A?: number | null;
  size34B?: number | null;
  size34C?: number | null;
  size34D?: number | null;
  size36A?: number | null;
  size36B?: number | null;
  size36C?: number | null;
  size36D?: number | null;
  sale: boolean;
  favorite: boolean;
  id: number;
  type: string;
  category: string;
}

export const useProductsInfoStore = defineStore("productsInfo", () => {
  const originalManProductList = ref<Product[]>([]);
  const originalWomanProductList = ref<Product[]>([]);
  const accessoryProductList = ref<Product[]>([]);
  const firestoreDataForMan = ref<any[]>([]);
  const firestoreDataForWoman = ref<any[]>([]);
  const firestoreDataForAccessory = ref<any[]>([]);

  onMounted(async () => {
    const querySnapshotForMan = await getDocs(collection(db, "manClothes"));
    const querySnapshotForWoman = await getDocs(collection(db, "womanClothes"));
    const querySnapshotForAccessory = await getDocs(
      collection(db, "accessory")
    );
    firestoreDataForMan.value = querySnapshotForMan.docs.map((doc) =>
      doc.data()
    );
    firestoreDataForWoman.value = querySnapshotForWoman.docs.map((doc) =>
      doc.data()
    );
    firestoreDataForAccessory.value = querySnapshotForAccessory.docs.map(
      (doc) => doc.data()
    );
  });
  const updateManProducts = () => {
    originalManProductList.value = firestoreDataForMan.value.map(
      (data: any) => {
        return reactive({
          name: data.name,
          price: data.price,
          img: data.URL,
          img2: data.URL2,
          color: data.color,
          availableColors: data.availableColors,
          sizeXS: data.XS,
          sizeS: data.S,
          sizeM: data.M,
          sizeL: data.L,
          sizeXL: data.XL,
          onesize: data.onesize,
          size25: data.size25,
          size26: data.size26,
          size24: data.size24,
          favorite: false,
          sale: data.sale,
          id: data.id,
          type: data.type,
          category: data.category,
        });
      }
    );
  };
  const updateWomanProducts = () => {
    originalWomanProductList.value = firestoreDataForWoman.value.map(
      (data: any) => {
        return reactive({
          name: data.name,
          price: data.price,
          img: data.URL,
          img2: data.URL2,
          color: data.color,
          availableColors: data.availableColors,
          sizeXS: data.XS,
          sizeS: data.S,
          sizeM: data.M,
          sizeL: data.L,
          sizeXL: data.XL,
          onesize: data.onesize,
          size25: data.size25,
          size26: data.size26,
          size24: data.size24,
          size32A: data.size32A,
          size32B: data.size32B,
          size32C: data.size32C,
          size32D: data.size32D,
          size34A: data.size34A,
          size34B: data.size34B,
          size34C: data.size34C,
          size34D: data.size34D,
          size36A: data.size36A,
          size36B: data.size36B,
          size36C: data.size36C,
          size36D: data.size36D,
          favorite: false,
          sale: data.sale,
          id: data.id,
          type: data.type,
          category: data.category,
        });
      }
    );
  };
  const updateAccessoryProducts = () => {
    accessoryProductList.value = firestoreDataForAccessory.value.map(
      (data: any) => {
        return reactive({
          name: data.name,
          price: data.price,
          img: data.URL,
          img2: data.URL2,
          color: data.color,
          availableColors: data.availableColors,
          sizeXS: data.XS,
          sizeS: data.S,
          sizeM: data.M,
          sizeL: data.L,
          sizeXL: data.XL,
          onesize: data.onesize,
          size25: data.size25,
          size26: data.size26,
          size24: data.size24,
          favorite: false,
          sale: data.sale,
          id: data.id,
          type: data.type,
          category: data.category,
        });
      }
    );
  };

  watch(firestoreDataForMan, async () => {
    await nextTick();
    updateManProducts();
  });
  watch(firestoreDataForWoman, async () => {
    await nextTick();
    updateWomanProducts();
  });
  watch(firestoreDataForAccessory, async () => {
    await nextTick();
    updateAccessoryProducts();
  });

  const manProductList = computed(() => {
    return [...originalManProductList.value, ...accessoryProductList.value];
  });
  const womanProductList = computed(() => {
    return [...originalWomanProductList.value, ...accessoryProductList.value];
  });

  return {
    manProductList,
    womanProductList,
  };
});

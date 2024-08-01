import { ref } from "vue";
import { defineStore } from "pinia";

export const useCurrentOrderStore = defineStore("currentOrder", () => {
  const orderType = ref("");

  return { orderType };
});

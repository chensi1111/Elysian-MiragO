import { ref } from "vue";
import { defineStore } from "pinia";

export const useCurrentGenderStore = defineStore('currentGender', () => {
    const storedGender = localStorage.getItem('currentGender') || 'man';
    const currentGender = ref<string>(storedGender);
   
    const toMan = () => {
        currentGender.value = "man"
        localStorage.setItem('currentGender', currentGender.value);
    }
    const toWoman = () => {
        currentGender.value = "woman"
        localStorage.setItem('currentGender', currentGender.value);
    }
    return { currentGender, toMan, toWoman }
})
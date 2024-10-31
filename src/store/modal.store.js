import { defineStore } from "pinia";

export const useModalStore = defineStore("dialog", {
  state: () => ({
    isVisible: false, // Dialog visibility state
  }),
});

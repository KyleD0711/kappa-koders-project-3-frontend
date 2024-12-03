// editProfileModal.store.js
import { defineStore } from 'pinia';

export const useEditProfileModalStore = defineStore('editProfileModal', {
  state: () => ({
    isVisible: false, // Controls visibility of the Edit Profile modal
  }),
  actions: {
    open() {
      this.isVisible = true; // Set the modal to visible
    },
    close() {
      this.isVisible = false; // Set the modal to hidden
    },
  },
  persist: true, // Optional: Enables persistence across page reloads
});

import { defineStore } from "pinia";

export const useResumeViewerStore = defineStore("resumeViewer", {
  state: () => ({
    innerHTML: "", // Dialog visibility state
  }),
  actions: {
    updateInnerHTML(newHTML) {
      this.innerHTML = newHTML;
    },
  },
});

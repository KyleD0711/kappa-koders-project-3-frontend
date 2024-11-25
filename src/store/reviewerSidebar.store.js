import { defineStore } from "pinia";

export const useReviewerSidebarStore = defineStore("reviewerSidebar", {
  state: () => ({
    sectionData: [], // Section Data
    overviewData: "",
  }),
  actions: {
    updateSectionData(sectionData) {
      this.sectionData = sectionData;
    },
    addSectionData(sectionData) {
      this.sectionData.push(sectionData);
    },
    updateOverviewData(overviewData) {
      this.overviewData = overviewData;
    },
  },
});

import { defineStore } from "pinia";

export const useResumeViewerStore = defineStore("resumeViewer", {
  state: () => ({
    innerHTML: "", // Dialog visibility state
    pdfData: JSON.parse(localStorage.getItem("pdfData")) || {}, // Load data from localStorage if available
  }),
  actions: {
    updateInnerHTML(newHTML) {
      this.innerHTML = newHTML;
    },
    updatePdf(pdfSrc) {
      // Extract resumeId from the HTML content (assuming `pdfSrc` is the HTML content)
      const parser = new DOMParser();
      const doc = parser.parseFromString(pdfSrc, "text/html");
      const resumeId = doc.querySelector('[name="pdf"]')?.getAttribute('resumeid');

      if (resumeId) {
        this.pdfData[resumeId] = pdfSrc; // Store PDF source by resumeId

        // Persist to localStorage
        localStorage.setItem("pdfData", JSON.stringify(this.pdfData));
      } else {
        console.error("[updatePdf] - resumeId not found in PDF content.");
      }
    },
    // Get PDF data for a specific resumeId
    getPdf(resumeId) {
      console.log("Getting screenshot for resumeId:", resumeId);
      return this.pdfData[resumeId] || ""; // Return PDF for the given resumeId, or empty if not found
    },
  },
});

import { ref, reactive  } from "vue";
import { defineStore } from "pinia";

export const useResumeViewerStore = defineStore("resumeViewer", () => {
  // Reactive state
  const innerHTML = ref(""); // Store for HTML content
  const pdfData = reactive(
    JSON.parse(localStorage.getItem("pdfData")) || {} // Load data from localStorage if available
  );

  // Actions
  const updateInnerHTML = (newHTML) => {
    innerHTML.value = newHTML;
  };

  const updatePdf = (pdfSrc) => {
    // Extract resumeId from the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(pdfSrc, "text/html");
    const resumeId = doc.querySelector('[name="pdf"]')?.getAttribute("resumeid");

    if (resumeId) {
      pdfData[resumeId] = pdfSrc; // Store PDF source by resumeId

      // Persist to localStorage
      localStorage.setItem("pdfData", JSON.stringify(pdfData));
    } else {
      console.error("[updatePdf] - resumeId not found in PDF content.");
    }
  };

  const getPdf = (resumeId) => {
    console.log("Getting screenshot for resumeId:", resumeId);
    return pdfData[resumeId] || ""; // Return PDF for the given resumeId, or empty if not found
  };

  // Expose state and actions
  return {
    innerHTML,
    pdfData,
    updateInnerHTML,
    updatePdf,
    getPdf,
  };
});

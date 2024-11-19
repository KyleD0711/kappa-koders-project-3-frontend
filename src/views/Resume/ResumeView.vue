<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import jsPDF from "jspdf";
import { ref } from "vue";
import template from "../../../templates/templates.json";
const templateData = ref(template["template4"]);

const metadata = ref({});
const header_data = ref({});
const resume_data = ref({});
const isLoaded = ref({});

const resumeViewer = ref(null);
const resumeSidebar = ref(null);

const exportToPDF = () => {
  const pdfContent = resumeViewer.value?.pdf;

  const pdfTitle = resumeSidebar.value?.resumeTitle;

  if (pdfContent) {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [816, 1056],
    });

    pdf.html(pdfContent, {
      x: 0, // Half-inch margin
      y: -20, // Half-inch margin
      html2canvas: {
        scale: 1, // Adjust scale for better fit
        useCORS: true,
      },
      callback: (doc) => {
        doc.save("myResume.pdf");
      },
    });
  } else {
    console.error("PDF content is not accessible!");
  }
};

const handleDataChange = (data) => {
  if (data.metadata) {
    metadata.value = data.metadata;
  }

  if (data.resume_data) {
    resume_data.value = data.resume_data;
  }

  if (data.header_data) {
    header_data.value = data.header_data;
  }

  if (data.isLoaded) {
    isLoaded.value = data.isLoaded;
  }
};
</script>
<template>
  <div style="display: flex">
    <div style="width: 30%">
      <ResumeSidebar
        :resume_data="resume_data"
        @dataChange="handleDataChange"
      />
    </div>
    <v-divider
      vertical
      :thickness="4"
      class="white border-opacity-100"
    ></v-divider>
    <div style="flex-grow: 1; padding-left: 10%">
      <ResumeViewer
        @dataChange="handleDataChange"
        :is-loaded="isLoaded"
        :template="templateData"
        :metadata="metadata"
        :header_data="header_data"
        :resume_data="resume_data"
      />
    </div>
  </div>
</template>

<style scoped>
.white {
  color: #737373;
  padding-left: 1%;
}
</style>

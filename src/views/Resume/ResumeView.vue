<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import jsPDF from "jspdf";
import { ref } from "vue";
import template from "../../../templates/templates.json";
const templateData = ref(template["template3"]);

const metadata = ref({});
const header_data = ref({});
const resume_data = ref({});
const isLoaded = ref({});

const resumeViewer = ref(null);
const resumeSidebar = ref(null);

const route = useRoute();
const resumeId = route.params.resumeId;

// On mounted, log the resumeId
onMounted(() => {
  console.log(resumeId);
});

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
      x: 0,
      y: -20,
      html2canvas: {
        scale: 1,
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

// Handle data change
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

  console.log(metadata.value, resume_data.value, header_data.value);
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
.white-text {
  color: white;
}

.white {
  color: #737373;
  padding-left: 1%;
}
</style>

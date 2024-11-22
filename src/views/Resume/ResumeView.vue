<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import jsPDF from 'jspdf';
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from "vue";
import template from "../../../templates/templates.json";

// Reactive variables
const selectedTemplate = ref('template1'); // Default to 'template1'
const templateData = ref(template["template1"]);
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

// Watch the selectedTemplate for changes
watch(selectedTemplate, (newTemplateKey) => {
  console.log('Selected template:', newTemplateKey);
  templateData.value = template[newTemplateKey] || {}; // Dynamically select the template
});

// Export to PDF function
const exportToPDF = () => {
  const pdfContent = resumeViewer.value?.pdf;
  const pdfTitle = resumeSidebar.value?.resumeTitle;

  if (pdfContent) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
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
        doc.save(`${pdfTitle}.pdf`);
      },
    });
  } else {
    console.error('PDF content is not accessible!');
  }
};

// Handle data change
const handleDataChange = (data) => {
  if (data.metadata) {
    metadata.value = data.metadata

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
        ref="resumeSidebar"
        :resume_data="resume_data"
        @dataChange = "handleDataChange" />
    </div>
    <v-divider
      vertical
      :thickness="4"
      class="white border-opacity-100"
    ></v-divider>
    
    <div style="flex-grow: 1; display: flex; flex-direction: column; align-items: center; padding-left: 10%;">
      <!-- Add the white--text class to v-tabs -->
      <v-tabs v-model="selectedTemplate" vertical class="white-text" style="padding-right: 5%">
        <v-tab v-for="templateKey in templates" :key="templateKey" :value="templateKey" class="white-text">
          {{ templateKey }}
        </v-tab>
      </v-tabs>

      <!-- ResumeViewer placed below tabs -->
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

<script setup>
import { onMounted, ref } from "vue";

import { useRouter } from "vue-router";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useResumeViewerStore } from '../../store/resumeViewer.store';
import html2canvas from "html2canvas"; 

const resumeViewerStore = useResumeViewerStore();
const pdf = ref('');
const screenshotSrc = ref({});  // Changed to store different screenshots based on resumeId


dayjs.extend(relativeTime);

const router = useRouter();

const props = defineProps({
  resumeData: {
    type: Object,
    required: true,
  },
});

const reviewResume = () => {
  router.push({
    name: "reviewResume",
    params: { reviewId: props.resumeData.review[0].id },
  });
};


onMounted(() => {
  const resumeId = props.resumeData.id;  

  pdf.value = resumeViewerStore.getPdf(resumeId);
  if (pdf.value) {
    captureScreenshot(pdf.value);
  }
});

const captureScreenshot = (pdfContent) => {
  console.log("[captureScreenshot] - Capturing screenshot...");

  // Parse the HTML string back to a DOM element
  const parser = new DOMParser();
  const doc = parser.parseFromString(pdfContent, "text/html");

  // Extract the resumeId from the pdfContent using the resumeid attribute
  const resumeId = doc.querySelector('[name="pdf"]')?.getAttribute('resumeid');
  
  if (!resumeId) {
    console.error("[captureScreenshot] - Resume ID not found in the PDF content.");
    return;
  }

  console.log('Resume ID:', resumeId);

  // Append the parsed content to the body temporarily
  const tempElement = doc.body;
  document.body.appendChild(tempElement);

  // Set the width and height based on the content provided
  tempElement.style.width = '816px';  // Matches the width in the PDF
  tempElement.style.height = '500px';  // Original content height
  tempElement.style.transform = 'scale(1)';  // No scaling applied, adjust as needed
  tempElement.style.transformOrigin = 'top left';
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'visible';

  // Use html2canvas to capture the screenshot (cutting off after 10 inches, i.e., 960px)
  html2canvas(tempElement, {
    scale: 1,  // Capture at actual pixel resolution
    width: 816,  // Set width in pixels
    height: 500,  // Capture 10 inches (960px)
    scrollX: 0,  // Adjust if needed
    scrollY: -750,  // Adjust if needed to capture the top part
  })
    .then((canvas) => {
      // Use resumeId to store screenshotSrc separately for each resume
      screenshotSrc.value[resumeId] = canvas.toDataURL("image/png");  // Store screenshot data URL by resumeId
    })
    .catch((error) => {
      console.error("[captureScreenshot] - Error capturing screenshot:", error);
    })
    .finally(() => {
      // Remove the temporarily appended element from the DOM after capturing
      document.body.removeChild(tempElement);
    });
};
</script>

<template>
  <v-card class="w-100" color="#646262" @click="reviewResume()">
    <v-img
      :src="screenshotSrc[props.resumeData.id] || './BlankResumeForList.png'"  
      cover
    />    
    <v-row class="align-center">
      <v-col cols="8">
        <v-card-title class="text-wrap">
          {{ props.resumeData.user.fName + " " + props.resumeData.user.lName }}
        </v-card-title>
        <v-card-text class="pt-0">
          Resume Name: {{ props.resumeData.name }}
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

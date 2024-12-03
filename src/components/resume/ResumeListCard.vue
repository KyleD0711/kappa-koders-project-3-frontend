<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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
  }
});

const emit = defineEmits(['delete']);

const dateToRelativeTime = (date) => {
  const inputDate = dayjs(date);
  const now = dayjs();

  if (!inputDate.isValid()) {
    return 'Invalid date';
  }

  const diffInDays = now.diff(inputDate, 'day');
  const diffInWeeks = now.diff(inputDate, 'week');
  const diffInMonths = now.diff(inputDate, 'month');
  const diffInYears = now.diff(inputDate, 'year');

  if (diffInYears >= 1) {
    return `${diffInYears} Year${diffInYears > 1 ? 's' : ''} ago`;
  } else if (diffInMonths >= 1) {
    return `${diffInMonths} Month${diffInMonths > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks >= 1) {
    return `${diffInWeeks} Week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays >= 2) {
    return `${diffInDays} Day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else {
    return 'Today';
  }
};

const editResume = () => {
  router.push({ name: 'editResume', params: { resumeId: props.resumeData.id } });
};

const deleteResume = () => {
  emit('delete', props.resumeData);
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

  const parser = new DOMParser();
  const doc = parser.parseFromString(pdfContent, "text/html");

  const resumeId = doc.querySelector('[name="pdf"]')?.getAttribute('resumeid');
  
  if (!resumeId) {
    console.error("[captureScreenshot] - Resume ID not found in the PDF content.");
    return;
  }

  console.log('Resume ID:', resumeId);

  const tempElement = doc.body;
  document.body.appendChild(tempElement);

  
  tempElement.style.width = '816px'; 
  tempElement.style.height = '500px';  
  tempElement.style.transform = 'scale(1)'; 
  tempElement.style.transformOrigin = 'top left';
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'visible';

  const dynamicScrollY = Math.max(window.innerHeight * 1.0, 500); 


  html2canvas(tempElement, {
    scale: 1,  
    width: 816, 
    height: 500, 
    scrollX: 0, 
    scrollY: -dynamicScrollY, 
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
  <v-card class="w-100" color="#646262">
    <!-- Use resumeId to dynamically get the correct screenshot -->
    <v-img
      :src="screenshotSrc[props.resumeData.id] || './BlankResumeForList.png'"  
      cover
      @click="editResume"
    />
    <v-row class="align-center">
      <v-col cols="8">     
        <v-card-title class="text-wrap">
          {{ props.resumeData.name }}
        </v-card-title>
        <v-card-text class="pt-0">
          Updated {{ dateToRelativeTime(props.resumeData.updatedAt) }}
        </v-card-text>
      </v-col>
      <v-col cols="4" class="align-content-center">
        <v-row class="justify-end px-4" no-gutters>
          <v-icon class="mr-4" @click="editResume()">
            mdi-pencil
          </v-icon>
          <v-icon @click="deleteResume()"> mdi-delete </v-icon>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

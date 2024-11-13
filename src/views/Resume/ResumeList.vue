<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import { ref } from 'vue';

const resume_data = ref({});
const metadata = ref({});
const header_data = ref({});
const template = ref({});

</script>

<template>
  <div style="display: flex;">
    <div style="width: 50%;">
      <ResumeSidebar 
        @updateResumeData="resume_data = $event" 
        @updateHeader_data="header_data = $event" 
        @updateMetadata="metadata = $event" 
        @updateTemplate="template = $event" 

      />
    </div>
    <v-divider vertical :thickness="4" class="white border-opacity-100"></v-divider>
    <div style="flex-grow: 1;">
      <ResumeViewer 
        v-if="resume_data && metadata && header_data" 
        :resume_data="resume_data" 
        :metadata="metadata" 
        :header_data="header_data"
        :template="template"
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

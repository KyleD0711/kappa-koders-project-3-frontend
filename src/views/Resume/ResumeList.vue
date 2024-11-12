<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import { ref } from 'vue';

const resume_data = ref({});

</script>
<template>
  <div style="display: flex;">
    <div style="width: 50%;">
      <ResumeSidebar :resume_data="resume_data"/>
    </div>
    <div style="flex-grow: 1;">
      <ResumeViewer :resume_data="resume_data"/>
    </div>
  </div>
</template>
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
    <v-divider vertical :thickness="4" class="white border-opacity-100"></v-divider>
    <div style="flex-grow: 1;">
      <ResumeViewer :resume_data="resume_data"/>
    </div>
  </div>
</template>

<style scoped>

.white{
  color: #737373;
  padding-left: 1%;
}

</style>
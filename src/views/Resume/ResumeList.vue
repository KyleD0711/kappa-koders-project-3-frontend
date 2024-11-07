<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
</script>
<template>
  <div style="display: flex;">
    <div style="width: 30%;">
      <ResumeSidebar />
    </div>
    <div style="flex-grow: 1;">
      <ResumeViewer />
    </div>
  </div>
</template>
<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ReviewerSidebar from "../../components/admin/ReviewerSidebar.vue";
</script>
<template>
  <div style="display: flex">
    <ReviewerSidebar
      style="max-width: 30%; min-width: 15%; height: 100%; margin-top: 20px"
    ></ReviewerSidebar>
    <div style="padding-left: 10%">
      <ResumeViewer></ResumeViewer>
    </div>
  </div>
</template>

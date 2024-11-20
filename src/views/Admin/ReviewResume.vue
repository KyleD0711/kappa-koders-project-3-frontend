<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ReviewerSidebar from "../../components/admin/ReviewerSidebar.vue";
</script>
<template>
  <div style="display: flex; align-items: stretch">
    <div
      style="
        max-width: 30%;
        min-width: 15%;
        height: 100%;
        margin-top: 20px;
        border-color: #d9d9d9;
        border-right: 5px;
      "
    >
      <ReviewerSidebar></ReviewerSidebar>
    </div>
    <div style="padding-left: 10%">
      <ResumeViewer></ResumeViewer>
    </div>
  </div>
</template>
<style scoped></style>

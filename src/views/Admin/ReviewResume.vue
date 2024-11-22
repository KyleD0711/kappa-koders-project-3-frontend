<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ReviewerSidebar from "../../components/admin/ReviewerSidebar.vue";
import { ref } from "vue";

const props = defineProps({
  reviewId: {
    type: Number,
    required: true,
  },
});

const metadata = ref({});
const resume_data = ref({});
const header_data = ref({});
const template = ref({});
const isLoaded = ref(false);
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
    <v-divider
      vertical
      :thickness="4"
      class="white border-opacity-100"
    ></v-divider>
    <div style="padding-left: 10%">
      <ResumeViewer
        :metadata="metadata"
        :resume_data="resume_data"
        :header_data="header_data"
        :template="template"
        :isLoaded="isLoaded"
      ></ResumeViewer>
    </div>
  </div>
</template>
<style scoped>
.white {
  color: #737373;
  padding-left: 1%;
}
</style>

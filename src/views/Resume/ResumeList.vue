<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import { ref } from "vue";
import template from "../../../templates/templates.json";
const templateData = ref(template["template1"]);

const metadata = ref({});
const header_data = ref({});
const resume_data = ref({});
const isLoaded = ref({});

const handleDataChange = (data) => {
  // console.clear();
  console.log("[Resume List] - Data Change");
  if (data.metadata) {
    console.log("[Resume List] - metadata has been changed");
    metadata.value = data.metadata;
  }
  
  if (data.resume_data) {
    console.log("[Resume List] - resume_data has been changed");
    resume_data.value = data.resume_data;
  }
  
  if (data.header_data) {
    console.log("[Resume List] - header_data has been changed");
    header_data.value = data.header_data;
  }
  
  if (data.isLoaded){
    console.log("[Resume List] - isLoaded has been changed to " + data.isLoaded);
    isLoaded.value = data.isLoaded;
  }
}




</script>
<template>
  <div style="display: flex">
    <div style="width: 50%">
      <ResumeSidebar 
        :resume_data="resume_data"
        @dataChange = "handleDataChange" />
    </div>
    <v-divider
      vertical
      :thickness="4"
      class="white border-opacity-100"
    ></v-divider>
    <div style="flex-grow: 1">
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
.white {
  color: #737373;
  padding-left: 1%;
}
</style>
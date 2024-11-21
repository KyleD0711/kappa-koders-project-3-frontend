<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import jsPDF from 'jspdf';
import { useRoute } from 'vue-router';
import Chat from "../../components/chat/Chat.vue"
import { computed, ref, onMounted, watch } from "vue";
import template from "../../../templates/templates.json";

const drawerCols = 4;

// Reactive variables
const selectedTemplate = ref('template1'); // Default to 'template1'
const templateData = ref(template["template1"]);
const metadata = ref({});
const header_data = ref({});
const resume_data = ref({});
const isLoaded = ref({});

const leftTab = ref(null)
const rightTab = ref(null)

const leftDrawer = ref(true);
const rightDrawer = ref(false)

watch(rightTab, (newVal) => {
  if (newVal !== null) {
    leftTab.value = null; // Deselect left tab when a right tab is selected
    rightDrawer.value = true; // Open right drawer
    leftDrawer.value = false; // Close left drawer
  }
});

watch(leftTab, (newVal) => {
  if (newVal !== null) {
    rightTab.value = null; // Deselect right tab when a left tab is selected
    leftDrawer.value = true; // Open left drawer
    rightDrawer.value = false; // Close right drawer
  }
});

const handleDataChange = (data) => {
  if (data.metadata) {
    metadata.value = data.metadata;
  }

  if (data.resume_data) {
    resume_data.value = data.resume_data;
  }

  if (data.header_data) {
    header_data.value = data.header_data;
  }

  if (data.isLoaded) {
    isLoaded.value = data.isLoaded;
  }
};

const drawerWidth = computed(() => {
  const totalWidth = window.innerWidth; // Get screen width
  return (drawerCols / 12) * totalWidth;
})

// Reactive slide selection
const templates = ['template1', 'template2', 'template3', 'template4'];
</script>

<template>
  <v-row class="justify-space-between" no-gutters>
      <v-tabs
        v-model="leftTab"
        direction="vertical"
        hide-slider
      >
        <v-card class="mt-1 tab-width tab-left" :color="leftTab == 0 ? 'teal' : ''">
          <v-tab  height="125">
            <v-icon size="x-large">mdi-pencil</v-icon>
          </v-tab>
        </v-card>
      </v-tabs>

      <v-navigation-drawer
        v-model="leftDrawer"
        location="left"
        color="#4c4c4c"
        :width="drawerWidth"
      >
        <ResumeSidebar 
          :resume_data="resume_data"
          @dataChange = "handleDataChange" />
      </v-navigation-drawer>

    <div class="scroll-pane">
      <ResumeViewer
        @dataChange="handleDataChange"
        ref="resumeViewer"
        :resumeId="resumeId"
        :is-loaded="isLoaded"
        :template="templateData"
        :metadata="metadata"
        :header_data="header_data"
        :resume_data="resume_data"
      />
    </div>
    <v-tabs
      v-model="rightTab"
      direction="vertical"
      hide-slider
    >
      <v-card class="mt-1 tab-width tab-right" :color="rightTab == 0 ? 'teal' : ''">
        <v-tab size="large" height="125" >
          <v-icon size="large" class="ml-n2">mdi-chat</v-icon>
        </v-tab>
      </v-card>
      <v-card class="mt-1 tab-width tab-right"  :color="rightTab == 1 ? 'teal' : ''">
        <v-tab size="large" height="125">
          <v-icon size="large" class="ml-n2">mdi-comment-multiple</v-icon>
        </v-tab>
      </v-card>
    </v-tabs>
    <v-navigation-drawer
      v-model="rightDrawer"
      location="right"
      color="#4c4c4c"
      :width="drawerWidth"
    >
      <Chat v-if="rightTab == 0" :resume-id="1"/>
      <div v-else>
        <p class="text-h4">Comments Pane Goes Here</p>
      </div>
    </v-navigation-drawer>
  </v-row>
</template>

<style scoped>
.white-text {
  color: white;
}

.white {
  color: #737373;
  padding-left: 1%;
}

.tab-width {
  width: 50px;
}
.tab-right {
  border-radius: 10px 0px 0px 10px;
}
.tab-left {
  border-radius: 0px 10px 10px 0px;
}

.scroll-pane {
  height: 85vh;    /* Sets the height limit for scroll */
  overflow-y: auto;     /* Enables vertical scrolling */
  overflow-x: hidden;   /* Hides horizontal scrolling */
  box-sizing: border-box; /* Ensures padding is within total width/height */
  margin-top: 15px; 
  margin-bottom: 12px;
}

/* Custom scrollbar styling (works in webkit browsers like Chrome and Safari) */
.scroll-pane::-webkit-scrollbar {
  width: 8px;           /* Width of the scrollbar */
}

.scroll-pane::-webkit-scrollbar-thumb {
  background-color: #888; /* Scrollbar thumb color */
  border-radius: 4px;    /* Rounded edges */
}

.scroll-pane::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Darker color on hover */
}
</style>

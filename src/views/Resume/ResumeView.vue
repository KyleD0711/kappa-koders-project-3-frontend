<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import jsPDF from "jspdf";
import { useRoute } from "vue-router";
import Chat from "../../components/chat/Chat.vue";
import { computed, ref, onMounted, watch } from "vue";
import template from "../../../templates/templates.json";
import Comment from "../../components/comment/Comment.vue";
import reviewServices from "../../services/reviewServices";
import resumeServices from "../../services/resumeServices";
import templateServices from "../../services/templateServices";

const drawerCols = 4;

onMounted(async () => {
  console.log("Resume Data");
  console.log(resumeId);

  try {
    const response = await resumeServices.getResumeByID(resumeId);
    console.log(response);
    templateData.value = response.data.template.template_data;
    templateId.value = response.data.templateId;
  } catch (e) {
    console.log("Error");
  }

  selectedTemplate.value = "template" + templateId.value;
});
const templateId = ref();

// Reactive variables
const selectedTemplate = ref(""); // Default to 'template1'
const templateData = ref();
const metadata = ref({});
const header_data = ref({});
const resume_data = ref({});
const isLoaded = ref(false);

const resumeViewer = ref(null);
const resumeSidebar = ref(null);

const route = useRoute();
const resumeId = route.params.resumeId;

const leftTab = ref(null);
const rightTab = ref(null);

const leftDrawer = ref(true);
const rightDrawer = ref(false);

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

const switchDisplayedTemplate = async (id) => {
  try {
    const response = await templateServices.getTemplateForId(id);
    return response.data.template_data;
  } catch (e) {
    console.log(e);
  }
};

// Watch the selectedTemplate for changes
watch(selectedTemplate, async (newTemplateKey) => {
  let response = await switchDisplayedTemplate(newTemplateKey.substring(8));
  if (typeof response == "string") {
    templateData.value = JSON.parse(response);
  } else {
    templateData.value = response;
  }
});

// Export to PDF function
const exportToPDF = () => {
  const pdfContent = resumeViewer.value?.pdf;
  const pdfTitle = resumeSidebar.value?.resumeTitle;

  if (pdfContent) {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [816, 1066],
    });

    pdf.html(pdfContent, {
      x: 0,
      y: 0,
      html2canvas: {
        scale: 1,
        useCORS: true,
      },
      callback: (doc) => {
        doc.save(`${pdfTitle}.pdf`);
      },
    });
  } else {
    console.error("PDF content is not accessible!");
  }
};

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
});

// Reactive slide selection
const templates = ["template1", "template2", "template3", "template4"];
</script>

<template>
  <v-row class="justify-space-between" no-gutters>
    <v-tabs v-model="leftTab" direction="vertical" hide-slider>
      <v-card
        class="mt-1 tab-width tab-left"
        :color="leftTab == 0 ? 'lightBlue' : 'section0'"
      >
        <v-tab height="125">
          <v-icon size="x-large">mdi-pencil</v-icon>
        </v-tab>
      </v-card>
    </v-tabs>

    <v-navigation-drawer
      v-model="leftDrawer"
      location="left"
      color="secondary"
      :width="drawerWidth"
    >
      <ResumeSidebar
        ref="resumeSidebar"
        :resume_data="resume_data"
        :resumeId="String(resumeId)"
        :templateData="selectedTemplate"
        :exportFunction="exportToPDF"
        @dataChange="handleDataChange"
      />
    </v-navigation-drawer>
    <v-col class="mx-5">
      <v-tabs
        v-model="selectedTemplate"
        vertical
        class="slider-text mt-1"
        style="width: fit-content; margin: auto"
      >
        <v-tab
          v-for="templateKey in templates"
          :key="templateKey"
          :value="templateKey"
          color="slider-text"
        >
          {{ templateKey }}
        </v-tab>
      </v-tabs>
      <div class="scroll-pane">
        <ResumeViewer
          @dataChange="handleDataChange"
          ref="resumeViewer"
          :resumeId="String(resumeId)"
          :is-loaded="!!isLoaded"
          :template="templateData"
          :metadata="metadata"
          :header_data="header_data"
          :resume_data="resume_data"
        />
      </div>
    </v-col>
    <v-tabs v-model="rightTab" direction="vertical" hide-slider>
      <v-card
        class="mt-1 tab-width tab-right"
        :color="rightTab == 0 ? 'lightBlue' : 'section0'"
      >
        <v-tab size="large" height="125">
          <v-icon size="large" class="ml-n2" color="">mdi-chat</v-icon>
        </v-tab>
      </v-card>
      <v-card
        class="mt-1 tab-width tab-right"
        :color="rightTab == 1 ? 'lightBlue' : 'section0'"
      >
        <v-tab size="large" height="125">
          <v-icon size="large" class="ml-n2">mdi-comment-multiple</v-icon>
        </v-tab>
      </v-card>
    </v-tabs>
    <v-navigation-drawer
      v-model="rightDrawer"
      location="right"
      color="section0"
      :width="drawerWidth"
    >
      <div v-if="rightTab != null">
        <Chat v-if="rightTab == 0" :resume-id="resumeId" />
        <Comment
          v-else
          :resumeId="resumeId"
          :render_fields="metadata.render_fields"
        ></Comment>
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
  height: 79vh; /* Sets the height limit for scroll */
  width: fit-content;
  overflow-y: auto; /* Enables vertical scrolling */
  overflow-x: hidden; /* Hides horizontal scrolling */
  box-sizing: border-box; /* Ensures padding is within total width/height */
  margin: auto;
  margin-top: 15px;
  margin-bottom: 12px;
  padding-right: 8px;
}

/* Custom scrollbar styling (works in webkit browsers like Chrome and Safari) */
.scroll-pane::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
}

.scroll-pane::-webkit-scrollbar-thumb {
  background-color: #888; /* Scrollbar thumb color */
  border-radius: 4px; /* Rounded edges */
}

.scroll-pane::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Darker color on hover */
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify'

import ResumeServices from '../../services/resumeServices';

import ResumeCard from '../../components/resume/ResumeListCard.vue';
import ResumeAddModal from '../../components/resume/ResumeAddModal.vue';
import ConfirmationDialog from '../../components/ConfirmationDialog.vue';

import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const resumeList = ref([])
const dataLoaded = ref(false)
const showDialog = ref(false)

const resumeToDelete = ref({})

const { name } = useDisplay()

const pageCols = computed(() => {
  switch (name.value) {
    case 'xs': return 12
    case 'sm': return 12
    case 'md': return 10
    case 'lg': return 10
    case 'xl': return 8
    case 'xxl': return 8
  }
})

const getResumes = async () => {
    ResumeServices.getAllResumesForUser()
    .then((response) => {
        resumeList.value = response.data
        dataLoaded.value = true
    })
}

const showConfirmDelete = (resume) => {
  resumeToDelete.value = resume;
  console.log(resume)
  showDialog.value = true;
}

const deleteResume = () => {
  ResumeServices.deleteResume(resumeToDelete.value.id)
  .then(() => {
    getResumes()
    showDialog.value = false;
  })
}

onMounted(() => {
    getResumes()
})

</script>

<template>
  <div>
    <v-col :cols="pageCols" class="mx-auto">
        <v-row class="w-100 justify-space-between align-center" no-gutters>
          <p class="text-h4 my-4 ml-4 text-secondary" style="color: #f2f4f3 !important">My Resumes</p>
          <v-btn
            prepend-icon="mdi-plus"
            class="mr-6"
            style="border-color: #054a91; background-color: #054a91; color: #f2f4f3;"
            @click="isVisible = true"
          >
            Add Resume
          </v-btn>
        </v-row>
  
        <v-container class="ma-0 pa-0 scroll-pane" fluid v-if="dataLoaded">
          <v-row justify="start" class="resume-grid">
            <v-col
              v-for="resume in resumeList"
              :key="resume.id"
              cols="12"
              md="4"
              class="d-flex"
            >
              <ResumeCard :resume-data="resume" class="ma-4" @delete="showConfirmDelete"/>
            </v-col>
          </v-row>
        </v-container>
    </v-col>

    <ResumeAddModal />
  
    <ConfirmationDialog 
      :show="showDialog" 
      action="delete" 
      :entity="'\'' + resumeToDelete.name +'\''" 
      @action="deleteResume"
      @cancel="showDialog = false"
    />
  </div>
</template>

<style scoped>
.resume-grid {
  max-width: auto; /* Adjust to control the grid's width */
}

.scroll-pane {
  width: 100%;          /* Adjust width as needed */
  max-height: 75vh;    /* Sets the height limit for scroll */
  overflow-y: auto;     /* Enables vertical scrolling */
  overflow-x: hidden;   /* Hides horizontal scrolling */
  padding: 10px;        /* Optional padding */
  box-sizing: border-box; /* Ensures padding is within total width/height */

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
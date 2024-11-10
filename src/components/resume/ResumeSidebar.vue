<script setup>
import { ref, watch, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { VCard, VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VIcon } from 'vuetify/components';
import { useModalStore } from "../../store/modal.store";

// Education:
import EducationModal from '../education/EducationModal.vue';
import educationServices from '../../services/educationServices';

// Experience:
import ExperienceModal from '../experience/ExperienceModal.vue';
import experienceServices from '../../services/experienceServices';

// Project:
import ProjectModal from '../project/ProjectModal.vue';
import projectServices from '../../services/projectServices';

// award:
import AwardModal from '../award/AwardModal.vue';
import awardServices from '../../services/awardServices'; 

// Links:
import LinkModal from '../links/LinkModal.vue';
import linkServices from '../../services/linkServices';

// Skills
import SkillModal from '../skill/SkillModal.vue';
import skillServices from '../../services/skillServices';

import { storeToRefs } from 'pinia';

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const sections = ref([]);

const getEducation = async () => {
  try {
    const res = await educationServices.getAllEducationForUser();
    const educationSection = sections.value.find(section => section.title === 'Education');
    if (educationSection) {
      educationSection.items = res.data.map(item => ({ name: item.institution, selected: true, data: item }));
    } else {
      sections.value.push({
        title: 'Education',
        items: res.data.map(item => ({ name: item.institution, selected: true, data: item })),
        open: false,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getExperience = async () => {
  try {
    const res = await experienceServices.getAllExperienceForUser();
    const experienceSection = sections.value.find(section => section.title === 'Experience');
    if (experienceSection) {
      experienceSection.items = res.data.map(item => ({ name: item.employer, selected: true, data: item }));
    } else {
      sections.value.push({
        title: 'Experience',
        items: res.data.map(item => ({ name: item.employer, selected: true, data: item })),
        open: false,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getProject = async () => {
  try {
    const res = await projectServices.getAllProjectForUser();
    const projectSection = sections.value.find(section => section.title === 'Project');
    if (projectSection) {
      projectSection.items = res.data.map(item => ({ name: item.name, selected: true, data: item }));
    } else {
      sections.value.push({
        title: 'Project',
        items: res.data.map(item => ({ name: item.name, selected: true, data: item })),
        open: false,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getAwards = async () =>{
  try {
    const res = await awardServices.getAllAwards();
    const awardSection = sections.value.find(section => section.title === 'Award');
    if (awardSection) {
      awardSection.items = res.data.map(item => ({ name: item.institution, selected: true, data: item }));
    } else {
      sections.value.push({
        title: 'Award',
        items: res.data.map(item => ({ name: item.institution, selected: true, data: item })),
        open: false,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

const getLinks = async () =>{
  try {
    const res = await linkServices.getAllLinkForUser();
    const linkSection = sections.value.find(section => section.title === 'Link');
    if (linkSection) {
      linkSection.items = res.data.map(item => ({ name: item.name, selected: true, data: item }));
    } else {
      sections.value.push({
        title: 'Link',
        items: res.data.map(item => ({ name: item.name, selected: true, data: item })),
        open: false,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

const getSkills = async () =>{
  try {
    const res = await skillServices.getAllSkillForUser();
    const skillSection = sections.value.find(section => section.title === 'Skill');
    if (skillSection) {
      skillSection.items = res.data.map(item => ({ name: item.name, selected: true, data: item }));
    } else {
      sections.value.push({
        title: 'Skill',
        items: res.data.map(item => ({ name: item.name, selected: true, data: item })),
        open: false,
      });
    }
  } catch (err) {
    console.error(err);
  }
}


const editItem = (item, sectionTitle) => {
  if (sectionTitle === 'Education') {
    modalStore.education = item.data;
    modalStore.modalType = 'education';
  } else if (sectionTitle === 'Experience') {
    modalStore.experience = item.data; 
    modalStore.modalType = 'experience';
  } else if (sectionTitle === 'Project') {
    modalStore.project = item.data; 
    modalStore.modalType = 'project'; 
  } else if (sectionTitle === 'Award') {
    modalStore.award = item.data; 
    modalStore.modalType = 'award'; 
  }else if (sectionTitle === 'Link') {
    modalStore.link = item.data; 
    modalStore.modalType = 'link'; 
  } else if (sectionTitle === 'Skill') {
    modalStore.skill = item.data; 
    modalStore.modalType = 'skill'; 
  }
  else {
    console.error('Unsupported section:', sectionTitle);
  }

  modalStore.isVisible = true; 
};

const showAddDialog = (section) => {
  if (section === 'Education') {
    modalStore.education = {
      institution: "",
      credential_earned: "",
      date_to: "",
      date_from: "",
      gpa: "",
      coursework: null,
    };
    modalStore.isVisible = true; 
    modalStore.modalType = 'education'; 
  } else if (section === 'Experience') {
    modalStore.experience = {
      employer: "",
      position_title: "",
      date_start: "",
      date_end: "",
    };
    modalStore.isVisible = true; 
    modalStore.modalType = 'experience'; 
  } else if (section === 'Project') {
    modalStore.project = {
      name: "",
      description: "",
      date_start: "",
      date_completed: "",
    };
    modalStore.isVisible = true; 
    modalStore.modalType = 'project'; 
  } else if (section === 'Award') {
    modalStore.award = {
      institution: "",
      credential_earned: "",
      date_to: "",
      date_from: "",
      gpa: "",
      coursework: null,
    };
    modalStore.isVisible = true; 
    modalStore.modalType = 'award'; 
  } else if (section === 'Link') {
    modalStore.link = {
       name: "",
      url: ""
    };
    modalStore.isVisible = true; 
    modalStore.modalType = 'link'; 
  } else if (section === 'Skill') {
    modalStore.skill = {
      name: "",
      description: "",
      proficiency_level: "",
    };
    modalStore.isVisible = true; 
    modalStore.modalType = 'skill'; 
  } else {
    console.error('Unsupported section:', section);
  }
};

onMounted(() => {
  getEducation();
  getExperience();
  getProject();
  getAwards();
  getLinks();
  getSkills();
});

watch(sections, (newSections) => {
    //console.log("Sections updated:", JSON.stringify(newSections, null, 2));
}, { deep: true });
</script>

<template>
  <div class="sidebar">
    <div class="resumeTitle">
      Resume Name
      <v-icon style="padding-left: 33%; font-size: 30px;" class="edit-icon">mdi-pencil</v-icon>
    </div>
    
    <draggable class="section-1" v-model="sections" tag="ul">
      <template #item="{ element: section }">
        <v-card class="mb-3">
          <v-expansion-panels>
<v-expansion-panel v-model="section.open" class="section-0" :key="section.title">
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-drag</v-icon>
                {{ section.title }}
              </v-expansion-panel-title>
              <v-expansion-panel-text class="section-1">
                <draggable class="item-list" v-model="section.items" tag="ul">
                  <template #item="{ element: item }">
                    <v-card class="mb-3">
                      <li :key="item.name" class="list-item">
                        <div class="left-icons">
                          <v-icon>mdi-drag</v-icon>
                          <span>{{ item.name }}</span>
                        </div>
                        <div class="right-icons">
                          <v-icon @click="editItem(item, section.title)" class="edit-icon">mdi-pencil</v-icon>
                          <v-checkbox v-model="item.selected" class="v-checkbox pa-0 ma-0" />
                        </div>
                      </li>
                    </v-card>
                  </template>
                </draggable>
                <v-card @click="showAddDialog(section.title)">  
                  <div class="addSection">
                    Add {{section.title}} <v-icon style="padding-bottom: 1%;">mdi-plus</v-icon>
                  </div>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </template>
    </draggable>
    
    <!-- Conditionally render the correct modal based on modalType -->
    <EducationModal v-if="isVisible && modalStore.modalType === 'education'" :education="modalStore.education" @submit-form="getEducation" />
    <ExperienceModal v-if="isVisible && modalStore.modalType === 'experience'" :experience="modalStore.experience" @submit-form="getExperience" />
    <ProjectModal v-if="isVisible && modalStore.modalType === 'project'" :project="modalStore.project" @submit-form="getProject" />
    <AwardModal v-if="isVisible && modalStore.modalType === 'award'" :award="modalStore.award" @submit-form="getAwards" />
    <LinkModal v-if="isVisible && modalStore.modalType === 'link'" :link="modalStore.link" @submit-form="getLinks" />
    <SkillModal v-if="isVisible && modalStore.modalType === 'skill'" :skill="modalStore.skill" @submit-form="getSkills" />
  </div>
</template>

<style>
.sidebar {
  border: 2px solid #cccccc; 
  padding: 10px; 
  border-radius: 4px; 
}

.resumeTitle{
    color: white;
    padding-left: 5%;
    padding-bottom: 4%;
    font-size: 30px;
}

.addSection{ 
  text-align: center;
}

.section-1 {
  display: block;
  color:white;
  flex-direction: column;
}

.section-0 {
    background-color: #403F3F;
    color:white;
}

.v-checkbox {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px; 
}

.right-icons {
  display: flex;
  align-items: center;
  gap: 8px; 
}

.v-card {
  background-color: #D9D9D9; /* Or whatever color you want */
}


</style>

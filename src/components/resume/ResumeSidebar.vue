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
const headers = ref([]);
const options = ref({
  links: false,
  breaklines: false,
});
const personalInfo = ref({
  firstName: 'Jonah',
  lastName: 'Veit',
  email: 'jonah@gmail.com',
  professionalSummary: 'Bachelor of Arts degree candidate, with a major in Economics, and experience developing and analyzing cost models, providing quality assurance reviews, and creating process solutions to improve financial forecasts for clients. Looking to continue the development of risk management, audit, and compliance skills in a team-centered environment.',
});

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
      });
    }
  } catch (err) {
    console.error(err);
  }
}

const getLinks = async () =>{
  try {
    const res = await linkServices.getAllLinkForUser();
    const linkHeader = headers.value.find(header => header.title === 'Link');
    if (linkHeader) {
      linkHeader.items = res.data.map(item => ({ name: item.name, selected: true, data: item }));
    } else {
      headers.value.push({
        title: 'Link',
        items: res.data.map(item => ({ name: item.name, selected: true, data: item })),
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
      });
    }
  } catch (err) {
    console.error(err);
  }
}

const editLinkItem = (item) => {
  modalStore.link = item.data;
  modalStore.modalType = 'link';
  modalStore.isVisible = true; 
}

// edits
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
  } else if (sectionTitle === 'Skill') {
    modalStore.skill = item.data; 
    modalStore.modalType = 'skill'; 
  }
  else {
   console.error('Unsupported section:', sectionTitle);
  }

  modalStore.isVisible = true; 
};

// add link
const showAddLinkDialog = () => {
  modalStore.link = {
    name: "",
    url: ""
  };
  modalStore.isVisible = true; 
  modalStore.modalType = 'link'; 
}

// add
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

watch(headers, (newHeaders) => {
    console.log("Headers updated:", JSON.stringify(newHeaders, null, 2));
}, { deep: true });
</script>

<template>
  <div class="sidebar">
    <div class="resumeTitle" style="padding-top: 2%;">
      Resume Name
      <v-icon style="font-size: 30px;" class="edit-icon">mdi-pencil</v-icon>
    </div>
    
    <v-expansion-panels style="padding-bottom: 2%;">
      <v-expansion-panel class="section-0">
        <v-expansion-panel-title style="font-size:20px">
          Header
        </v-expansion-panel-title>
        <v-expansion-panel-text  class="panel-background">
          <div class="option-checkboxes">
            <v-form>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="personalInfo.firstName"
                    label="First Name"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="personalInfo.lastName"
                    label="Last Name"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="personalInfo.email"
                label="Email"
              ></v-text-field>

              <v-textarea
                v-model="personalInfo.professionalSummary"
                label="Professional Summary"
              ></v-textarea>
            </v-form>
            <v-checkbox v-model="options.breaklines" label="Include Breaklines" />
            <draggable v-model="headers" tag="ul">
              <template #item="{ element: header }">
                <v-card class="mb-3">
                  <v-expansion-panels>
                    <v-expansion-panel class="section-0" :key="header.title">
                      <v-expansion-panel-title>
                        Links
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <draggable class="item-list" v-model="header.items" tag="ul">
                          <template #item="{ element: item }">
                            <v-card class="mb-3">
                              <li :key="item.name" class="list-item">
                                <div class="left-icons">
                                  <v-icon>mdi-drag</v-icon>
                                  <span>{{ item.name }}</span>
                                </div>
                                <div class="right-icons">
                                  <v-icon @click="editLinkItem(item)" class="edit-icon">mdi-pencil</v-icon>
                                  <v-checkbox v-model="item.selected" class="v-checkbox pa-0 ma-0" />
                                </div>
                              </li>
                            </v-card>
                          </template>
                        </draggable>
                        <v-card @click="showAddLinkDialog()">  
                          <div class="addSection">
                            Add {{header.title}} <v-icon style="padding-bottom: 1%;">mdi-plus</v-icon>
                          </div>
                        </v-card>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </template>
            </draggable>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <hr class="light-breakline" />

    <draggable v-model="sections" tag="ul">
      <template #item="{ element: section }">
        <v-card class="mb-3">
          <v-expansion-panels>
            <v-expansion-panel class="section-0" :key="section.title">
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
  border: 2px solid #737373; 
  padding: 10px; 
  border-radius: 4px; 
}

.resumeTitle{
    color: white;
    padding-left: 2%;
    padding-bottom: 2%;
    font-size: 30px;
}

.addSection{ 
  text-align: center;
}

.section-1 {
  background-color: #575757;
  display: block;
  color:white;
  flex-direction: column;
}

.section-0 {
    background-color: #403F3F;
    color:white;
}

.option-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  background-color: #D9D9D9;
}

.panel-background {
  background-color: #575757;
  color: white; 
  padding: 16px; 
  border-radius: 4px; 
}

.light-breakline {
  border: none;
  border-top: 3px solid #737373;
  margin: 10px 0; 
  padding-bottom: 3%;
}


</style>

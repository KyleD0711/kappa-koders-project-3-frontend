<script setup>
import { ref, watch, onMounted } from "vue";
import draggable from "vuedraggable";
import {
  VCard,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelTitle,
  VExpansionPanelText,
  VIcon,
} from "vuetify/components";
import { useModalStore } from "../../store/modal.store";

import 'primeicons/primeicons.css'

// Education:
import EducationModal from "../education/EducationModal.vue";
import educationServices from "../../services/educationServices";

// Experience:
import ExperienceModal from "../experience/ExperienceModal.vue";
import experienceServices from "../../services/experienceServices";

// Project:
import ProjectModal from "../project/ProjectModal.vue";
import projectServices from "../../services/projectServices";

// award:
import AwardModal from "../award/AwardModal.vue";
import awardServices from "../../services/awardServices";

// Links:
import LinkModal from "../links/LinkModal.vue";
import linkServices from "../../services/linkServices";

// Skills
import SkillModal from '../skill/SkillModal.vue';
import skillServices from '../../services/skillServices';

// professional summaries
import professionalSummaryServices from '../../services/professionalSummaryServices';
import ProfessionalSummaryModal from '../professionalSummary/ProfessionalSummaryModal.vue';

// Resume Items
// skill
import skillItemServices from "../../services/skillItemServices";
import resumeSectionServices from "../../services/resumeSectionServices";
import resumeServices from "../../services/resumeServices";

import { storeToRefs } from "pinia";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(['dataChange']);

const resume_data = ref([]);
const header_data = ref([]);
const metadata = ref([]);
const isLoaded = ref({});

const resume_data_local = ref([]);
const header_data_local = ref([]);
const metadata_local = ref({
  render_fields: [],
  section_dividers: false,
});
const personalInfo = ref({
  fName: 'Jonah',
  lName: 'Veit',
  email: 'jonah@gmail.com',
  phone_number: '999-888-77777',
  professional_summary: null,
});



const professionalSummaries = ref([]);  
const resumeTitle = ref("Resume Name");
const isEditingTitle = ref(false);

const toggleEditTitle = () => {
  isEditingTitle.value = !isEditingTitle.value;
};

const saveTitle = () => {
  isEditingTitle.value = false;
};

const cancelEditTitle = () => {
  isEditingTitle.value = false;
  resumeTitle.value = "Resume Name"; 
};

const getEducation = async () => {
  try {
    const res = await educationServices.getAllEducationForUser();
    const educationSection = resume_data_local.value.find(
      (section) => section.title === "Education"
    );
    if (educationSection) {
      educationSection.items = res.data.map(item => ({ name: item.institution, selected: false, data: item }));
    } else {
      resume_data_local.value.push({
        title: 'Education',
        items: res.data.map(item => ({ name: item.institution, selected: false, data: item })),
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getExperience = async () => {
  try {
    const res = await experienceServices.getAllExperienceForUser();
    const experienceSection = resume_data_local.value.find(
      (section) => section.title === "Experience"
    );
    if (experienceSection) {
      experienceSection.items = res.data.map(item => ({ name: item.employer, selected: false, data: item }));
    } else {
      resume_data_local.value.push({
        title: 'Experience',
        items: res.data.map(item => ({ name: item.employer, selected: false, data: item })),
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getProject = async () => {
  try {
    const res = await projectServices.getAllProjectForUser();
    const projectSection = resume_data_local.value.find(
      (section) => section.title === "Project"
    );
    if (projectSection) {
      projectSection.items = res.data.map(item => ({ name: item.name, selected: false, data: item }));
    } else {
      resume_data_local.value.push({
        title: 'Project',
        items: res.data.map(item => ({ name: item.name, selected: false, data: item })),
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getAwards = async () => {
  try {
    const res = await awardServices.getAllAwards();
    const awardSection = resume_data_local.value.find(
      (section) => section.title === "Award"
    );
    if (awardSection) {
      awardSection.items = res.data.map(item => ({ name: item.institution, selected: false, data: item }));
    } else {
      resume_data_local.value.push({
        title: 'Award',
        items: res.data.map(item => ({ name: item.institution, selected: false, data: item })),
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getLinks = async () => {
  try {
    const res = await linkServices.getAllLinkForUser();
    const linkHeader = header_data_local.value.find(header => header.title === 'Link');
    if (linkHeader) {
      linkHeader.items = res.data.map(item => ({ name: item.name, selected: false, data: item }));
    } else {
      header_data_local.value.push({
        title: 'Link',
        items: res.data.map(item => ({ name: item.name, selected: false, data: item })),
      });
    }
  } catch (err) {
    console.error(err);
  }


}

const getSkills = async () => {
  try {
    const res = await skillServices.getAllSkillForUser();
    const skillSection = resume_data_local.value.find(
      (section) => section.title === "Skill"
    );
    if (skillSection) {
      skillSection.items = res.data.map(item => ({ name: item.name, selected: false, data: item }));
    } else {
      resume_data_local.value.push({
        title: 'Skill',
        items: res.data.map(item => ({ name: item.name, selected: false, data: item })),
      });
    }
  } catch (err) {
    console.error(err);
  }
}

const getProf_sums = async () => {
  try {
    const res = await professionalSummaryServices.getAllProfessionalSummaryForUser();  // API call for professional summaries
    professionalSummaries.value = res.data.map(item => ({
      summary: item.summary,
      selected: false,
      data: item
    }));
  } catch (err) {
    console.error('Error fetching professional summaries:', err);
  }
};

const editLinkItem = (item) => {
  modalStore.link = item.data;
  modalStore.modalType = 'link';
  modalStore.isVisible = true; 
}

const editProfessionalSummary = (item) => {
  modalStore.professionalSummary = item.data;  // Pass the full data of the item to the modal
  modalStore.modalType = 'professionalSummary';
  modalStore.isVisible = true;
};

// edits
const editItem = (item, sectionTitle) => {
  if (sectionTitle === "Education") {
    modalStore.education = item.data;
    modalStore.modalType = "education";
  } else if (sectionTitle === "Experience") {
    modalStore.experience = item.data;
    modalStore.modalType = "experience";
  } else if (sectionTitle === "Project") {
    modalStore.project = item.data;
    modalStore.modalType = "project";
  } else if (sectionTitle === "Award") {
    modalStore.award = item.data;
    modalStore.modalType = "award";
  } else if (sectionTitle === "Skill") {
    modalStore.skill = item.data;
    modalStore.modalType = "skill";
  } else {
    console.error("Unsupported section:", sectionTitle);
  }

  modalStore.isVisible = true;
};

// add link
const showAddLinkDialog = () => {
  modalStore.link = {
    name: "",
    url: "",
  };
  modalStore.isVisible = true; 
  modalStore.modalType = 'link'; 
};

const showAddSummaryDialog = () => {
  modalStore.professionalSummary = {
    summary: "",  
  };
  modalStore.isVisible = true;
  modalStore.modalType = 'professionalSummary';
};

// add
const showAddDialog = (section) => {
  if (section === "Education") {
    modalStore.education = {
      institution: "",
      credential_earned: "",
      date_to: "",
      date_from: "",
      gpa: "",
      coursework: null,
    };
    modalStore.isVisible = true;
    modalStore.modalType = "education";
  } else if (section === "Experience") {
    modalStore.experience = {
      employer: "",
      position_title: "",
      date_start: "",
      date_end: "",
    };
    modalStore.isVisible = true;
    modalStore.modalType = "experience";
  } else if (section === "Project") {
    modalStore.project = {
      name: "",
      description: "",
      date_start: "",
      date_completed: "",
    };
    modalStore.isVisible = true;
    modalStore.modalType = "project";
  } else if (section === "Award") {
    modalStore.award = {
      institution: "",
      credential_earned: "",
      date_to: "",
      date_from: "",
      gpa: "",
      coursework: null,
    };
    modalStore.isVisible = true;
    modalStore.modalType = "award";
  } else if (section === "Skill") {
    modalStore.skill = {
      name: "",
      description: "",
      proficiency_level: "",
    };
    modalStore.isVisible = true;
    modalStore.modalType = "skill";
  } else {
    console.error("Unsupported section:", section);
  }
};

onMounted(async () => {
  isLoaded.value = false;
  emit('dataChange', { isLoaded: isLoaded.value });
  
  document.body.style.caretColor = 'transparent';

  await Promise.all([
    getEducation(),
    getExperience(),
    getProject(),
    getAwards(),
    getLinks(),
    getSkills(),
    getProf_sums()
  ]);

 
  resume_data_local.value.forEach((section) => {
    if (section.isOpen === undefined) {
      section.isOpen = false;
    }
  });

  isLoaded.value = true;
  handleDataChange();  
});

watch([resume_data_local, header_data_local, personalInfo, metadata_local, isLoaded], () => {
  handleDataChange();
}, { deep: true });

const handleDataChange = () => {
  const changes = {};

  if (resume_data_local.value) {
    const parsedResumeData = parseResumeData(resume_data_local.value);
    resume_data.value = parsedResumeData;
    changes.resume_data = resume_data.value;

    const parsedMetadata = parseMetadata(metadata_local.value, parsedResumeData);
    metadata.value = parsedMetadata;
    changes.metadata = metadata.value;
  }

  if (header_data_local.value || personalInfo.value) {
    const parsedHeader_data = parseHeader_data(header_data_local.value, personalInfo.value);
    
    if (parsedHeader_data.link && Array.isArray(parsedHeader_data.link)) {

        parsedHeader_data.link = parsedHeader_data.link.map(link => {
          const plainLink = { ...link };
          return plainLink;
        });
    }

    header_data.value = parsedHeader_data;
    changes.header_data = header_data.value;
  }

  isLoaded.value = true;
  changes.isLoaded = isLoaded;

  emit('dataChange', changes);
};

const parseResumeData = (resumeData) => {
  const result = {};

  resumeData.forEach((section) => {
    if (section.items && Array.isArray(section.items)) {
      const selectedItems = section.items
        .filter((item) => item.selected === true)
        .map((item) => item.data || {});

      if (selectedItems.length > 0) {
        result[section.title.toLowerCase()] = selectedItems;
      }
    }
  });

  return result;
};

const parseHeader_data = (header_data, personalInfo) => {
  const result = {};

  header_data.forEach(header => {
    if (header.items && Array.isArray(header.items)) {
      const selectedItems = header.items
        .filter(item => item.selected === true) 
        .map(item => item.data || {});


      if (selectedItems.length > 0) {
        result[header.title.toLowerCase()] = selectedItems;
      }
    }
  });
  
  result.fName = personalInfo.fName || '';
  result.lName = personalInfo.lName || '';
  result.email = personalInfo.email || '';
  result.phone_number = personalInfo.phone_number || '';
  result.professional_summary = personalInfo.professional_summary || '';

  return result;
};

const parseMetadata = (metadata_local, resume_data) => {
  const result = {};

  result.render_fields = Object.keys(resume_data);
  result.section_dividers = metadata_local.section_dividers;
  
  return result;
};



const updateSummary = (summary) => {
  // Deselect all other summaries
  professionalSummaries.value.forEach(item => {
    if (item !== summary) {
      item.selected = false;
    }
  });


  if (summary.selected) {
    personalInfo.value.professional_summary = summary.summary;
  } else {
    personalInfo.value.professional_summary = null;  
  }
};

defineProps(['exportFunction']);

defineExpose({
  resumeTitle
})

const saveResume = async () => {
  try {
    // Create a new resume if it doesn't exist
    let resumeId = resume_data.value.resumeId;

    if (!resumeId) {
      // Create a new resume
      console.log(resume_data.value);
      const newResume = await createNewResume(resume_data.value);
      resumeId = newResume.id; // Store the new resume ID
      console.log("New Resume Created:", newResume);
    }

    // Check if ResumeSection exists
    const sectionExists = await checkIfResumeSectionExists(resumeId);

    let resumeSectionId;

    if (!sectionExists) {
      // Create new ResumeSection if it doesn't exist
      const newResumeSection = await createNewResumeSection(resume_data.value);
      console.log("New ResumeSection Created:", newResumeSection);
      resumeSectionId = newResumeSection.id; // Store the new ResumeSection ID
    } else {
      // If the ResumeSection exists, use its ID
      resumeSectionId = sectionExists.id;
    }

    // Now, create SkillItem and associate it with the ResumeSection
    await createSkillItem(resumeSectionId, resume_data.value.skillItem);
    console.log("SkillItem Created and Associated with ResumeSection:", resume_data.value.skillItem);

  } catch (error) {
    console.error("Error saving resume:", error);
  }
};

// Create a new resume
const createNewResume = async (resumeData) => {
  try {
    const resume = {
      userId: resumeData.userId,
      // Add other necessary fields for the new resume
    };

    const response = await resumeServices.createResume(resume);
    return response.data;
  } catch (error) {
    console.error("Error creating new Resume:", error);
    throw error;
  }
};

// Check if the ResumeSection exists
const checkIfResumeSectionExists = async (resumeId) => {
  try {
    const response = await resumeSectionServices.getSectionsForResume(resumeId);
    return response.data && response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.log("Error checking if ResumeSection exists:", error);
    return null; // If the ResumeSection doesn't exist, return null
  }
};

// Create a new ResumeSection
const createNewResumeSection = async (resumeData) => {
  try {
    const sectionData = {
      section_type: "skill", // Adjust this if needed, e.g., section type could be "experience", "education", etc.
      section_title: "Skills", // Default title, you can customize based on the user input
      resumeId: resumeData.resumeId, // Make sure to pass the resumeId for association
    };

    const response = await resumeSectionServices.createResumeSection(resumeData.resumeId, sectionData);
    return response.data;
  } catch (error) {
    console.log("Error creating new ResumeSection:", error);
    throw error;
  }
};

// Create SkillItem and associate it with the ResumeSection
const createSkillItem = async (resumeSectionId, skillData) => {
  try {
    const skillItem = {
      sectionId: resumeSectionId, // Associate SkillItem with ResumeSection
      skill_name: skillData.skill_name,
      skill_level: skillData.skill_level,
      skill_description: skillData.skill_description,
    };

    const response = await skillItemServices.createSkillItem(skillItem);
    return response.data;
  } catch (error) {
    console.error("Error creating SkillItem:", error);
    throw error;
  }
};


</script>

<template>
  <div>
    <div class="resumeTitle" style="padding-top: 2%">
      <template v-if="isEditingTitle">
        <div class="text-field-wrapper">
          <v-text-field
            v-model="resumeTitle"
            dense
            hide-details
            solo
            @blur="saveTitle"
            @keyup.enter="saveTitle"
          ></v-text-field>
          <v-icon class="close-icon" @click="cancelEditTitle">
            mdi-close
          </v-icon>
        </div>
      </template>
      <template v-else>
        <span @click="toggleEditTitle">{{ resumeTitle }}</span>
        <v-icon
          style="font-size: 30px; padding-left: 5%"
          class="edit-icon"
          @click="toggleEditTitle"
          >mdi-pencil</v-icon
        >

        <i 
          @click="exportFunction" 
          v-if="!isEditingTitle" 
          style="margin-left: 30px; vertical-align: middle; position: relative; top: -2px;" 
          class="pi pi-print">
        </i>      
      </template>
    </div>

    <v-expansion-panels style="padding-bottom: 2%">
      <v-expansion-panel class="section-0">
        <v-expansion-panel-title style="font-size: 20px">
          Header
        </v-expansion-panel-title>
        <v-expansion-panel-text class="panel-background">
          <div class="option-checkboxes">
            <v-form>
            <!-- Name, email, phone, etc. -->
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="personalInfo.fName" label="First Name"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="personalInfo.lName" label="Last Name"></v-text-field>
              </v-col>
            </v-row>
            <v-text-field v-model="personalInfo.email" label="Email"></v-text-field>
            <v-text-field v-model="personalInfo.phone_number" label="Phone Number"></v-text-field>
          </v-form>

          <v-card class="mb-3">
              <v-expansion-panels>
                <v-expansion-panel class="section-0">
                  <v-expansion-panel-title>
                    Professional Summaries
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <!-- Professional Summaries List -->
                    <ul>
                      <template v-for="summary in professionalSummaries" :key="summary.data.id">
                        <v-card class="mb-3">
                          <li class="list-item">
                            <div style="padding-left: 2%">
                              <span>{{ summary.summary.substring(0, 30) }}...</span> <!-- Show first 30 characters of the summary -->
                            </div>
                            <div class="right-icons">
                              <v-icon @click="editProfessionalSummary(summary)" class="edit-icon">mdi-pencil</v-icon>
                              <v-switch v-model="summary.selected" @change="updateSummary(summary)" class="v-checkbox pa-0 ma-0" />
                            </div>
                          </li>
                        </v-card>
                      </template>
                    </ul>
  
                    <!-- Add Professional Summary Card -->
                    <v-card @click="showAddSummaryDialog()">  
                      <div class="addSection">
                        Add Professional Summary <v-icon style="padding-bottom: 1%;">mdi-plus</v-icon>
                      </div>
                    </v-card>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>

            <draggable v-model="header_data_local" tag="ul">
              <template #item="{ element: header }">
                <v-card class="mb-3">
                  <v-expansion-panels>
                    <v-expansion-panel class="section-0" :key="header.title">
                      <v-expansion-panel-title> Links </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <draggable
                          class="item-list"
                          v-model="header.items"
                          tag="ul"
                        >
                          <template #item="{ element: item }">
                            <v-card class="mb-3">
                              <li :key="item.name" class="list-item">
                                <div class="left-icons">
                                  <v-icon>mdi-drag</v-icon>
                                  <span>{{ item.name }}</span>
                                </div>
                                <div class="right-icons">
                                  <v-icon
                                    @click="editLinkItem(item)"
                                    class="edit-icon"
                                    >mdi-pencil</v-icon
                                  >
                                  <v-checkbox
                                    v-model="item.selected"
                                    class="v-checkbox pa-0 ma-0"
                                  />
                                </div>
                              </li>
                            </v-card>
                          </template>
                        </draggable>
                        <v-card @click="showAddLinkDialog()">
                          <div class="addSection">
                            Add {{ header.title }}
                            <v-icon style="padding-bottom: 1%">mdi-plus</v-icon>
                          </div>
                        </v-card>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </template>
            </draggable>
            
            <v-checkbox v-model="metadata_local.section_dividers" label="Include section dividers" />

            
          </div>
          
          
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <hr class="light-breakline" />

    <draggable v-model="resume_data_local" tag="ul">
      <template #item="{ element: section, index }">
        <v-card class="mb-3">
          <v-expansion-panels v-model="resume_data_local[index].isOpen">
            <v-expansion-panel class="section-0">
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
                          <v-icon
                            @click="editItem(item, section.title)"
                            class="edit-icon"
                            >mdi-pencil</v-icon
                          >
                          <v-checkbox
                            v-model="item.selected"
                            class="v-checkbox pa-0 ma-0"
                          />
                        </div>
                      </li>
                    </v-card>
                  </template>
                </draggable>
                <v-card @click="showAddDialog(section.title)">
                  <div class="addSection">
                    Add {{ section.title }}
                    <v-icon style="padding-bottom: 1%">mdi-plus</v-icon>
                  </div>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </template>
    </draggable>

    <v-btn block style="background-color:#3D7AE2; color: white" @click="saveResume">
      Save Resume
    </v-btn>

    <!-- Conditionally render the correct modal based on modalType -->
    <EducationModal v-if="isVisible && modalStore.modalType === 'education'" :education="modalStore.education" @submit-form="getEducation" />
    <ExperienceModal v-if="isVisible && modalStore.modalType === 'experience'" :experience="modalStore.experience" @submit-form="getExperience" />
    <ProjectModal v-if="isVisible && modalStore.modalType === 'project'" :project="modalStore.project" @submit-form="getProject" />
    <AwardModal v-if="isVisible && modalStore.modalType === 'award'" :award="modalStore.award" @submit-form="getAwards" />
    <LinkModal v-if="isVisible && modalStore.modalType === 'link'" :link="modalStore.link" @submit-form="getLinks" />
    <SkillModal v-if="isVisible && modalStore.modalType === 'skill'" :skill="modalStore.skill" @submit-form="getSkills" />
    <ProfessionalSummaryModal v-if="isVisible && modalStore.modalType === 'professionalSummary'" :professionalSummary="modalStore.professionalSummary" @submit-form="getProf_sums"></ProfessionalSummaryModal>
  </div>
</template>

<style>
.edit-pencil-summary{
  cursor: pointer;
  padding-top: 13%;
}

.text-field-wrapper {
  position: relative;
}

.close-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 24px;
  cursor: pointer;
}

.resumeTitle {
  color: white;
  padding-left: 2%;
  padding-bottom: 2%;
  font-size: 30px;
  cursor: pointer;
}

.resumeTitle v-text-field {
  font-size: 30px;
  color: white;
}

.resumeTitle {
  color: white;
  padding-left: 2%;
  padding-bottom: 2%;
  font-size: 30px;
}

.addSection {
  text-align: center;
}

.section-1 {
  background-color: #575757;
  display: block;
  color: white;
  flex-direction: column;
}

.section-0 {
  background-color: #403f3f;
  color: white;
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
  background-color: #d9d9d9;
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

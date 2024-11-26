<script setup>
import { ref, watch, onMounted, defineProps, computed, defineEmits} from "vue";
import debounce from 'lodash/debounce';
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

import saveResume from "../../services/saveResumeService";

import resumeServices from "../../services/resumeServices";
import resumeSectionServices from "../../services/resumeSectionServices";

import { storeToRefs } from "pinia";
import { string } from "@vueform/vueform";
import educationItemServices from "../../services/educationItemServices";
import experienceItemServices from "../../services/experienceItemServices";
import projectItemServices from "../../services/projectItemServices";
import awardItemServices from "../../services/awardItemServices";
import linkItemServices from "../../services/linkItemServices";
import skillItemServices from "../../services/skillItemServices";
import professionalSummaryItemServices from "../../services/professionalSummaryItemServices";
// import { link } from "../../../../kappakoders-project3-backend/app/models";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(['dataChange']);

let resume;
let professional_Summary_id;

const resume_data = ref([]);
const header_data = ref([]);
const metadata = ref([]);
const isLoaded = ref({});

const props = defineProps({
  exportFunction: {
    type: Function,
    required: true,
  },
  resumeId: {
    type: String, // Fixed the type here
    required: true,
  },
  templateData: {
    type: [Object, String], // Fixed the type here
    required: true,
  },
});



const resume_data_local = ref([]);
const header_data_local = ref([]);
const metadata_local = ref({});
const personalInfo = ref({
  fName: "",
  lName: "",
  email: "",
  phone_number: "",
  professional_summary: "",
});

const professionalSummaries = ref([]);  
const resumeTitle = ref();
const isEditingTitle = ref(false);


const toggleEditTitle = () => {
  isEditingTitle.value = !isEditingTitle.value;
};

const saveTitle = () => {
  isEditingTitle.value = false;
};

const cancelEditTitle = () => {
  isEditingTitle.value = false;
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
        icon: 'pi pi-graduation-cap'
      });
    }
  } catch (err) {
    console.error(err);
  }
  processResumeData();
  
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
        icon: 'pi pi-briefcase'
      });
    }
  } catch (err) {
    console.error(err);
  }
  processResumeData();
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
        icon: 'pi pi-book'
      });
    }
  } catch (err) {
    console.error(err);
  }
  processResumeData();
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
        icon: 'pi pi-trophy'
      });
    }
  } catch (err) {
    console.error(err);
  }
  processResumeData();
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
        icon: 'pi pi-link'
      });
    }
  } catch (err) {
    console.error(err);
  }
  processResumeData();
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
        icon: 'pi pi-lightbulb'
      });
    }
  } catch (err) {
    console.error(err);
  }
  processResumeData();
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
  processResumeData();
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

const getResumeData = async (id) => {
  try {
    const response = await resumeServices.getAllResumesForUser();
    if (Array.isArray(response.data)) {
      // Convert `id` to a number if necessary and find the matching object
      const resume = response.data.find((resume) => resume.id === Number(id));
      if (resume) {
        return resume;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return null;
  }
};

onMounted(async () => {
  isLoaded.value = false;
  emit('dataChange', { isLoaded: isLoaded.value });
  
  document.body.style.caretColor = 'transparent';

  // Wait for the resume data
  resume = await getResumeData(props.resumeId);
  
  await Promise.all([
    getEducation(),
    getExperience(),
    getProject(),
    getAwards(),
    getLinks(),
    getSkills(),
    getProf_sums()
  ]);

  try {
    await processResumeData();
  } catch(err) {
  }
  

  resume_data_local.value.forEach((section) => {
    if (section.isOpen === undefined) {
      section.isOpen = false;
    }
  });

  
  isLoaded.value = true;
  handleDataChange();  
});


async function processResumeData() {
  // Set up resume metadata and personal info
  resume = await getResumeData(props.resumeId);
  resumeTitle.value = resume.name;
  if (typeof(resume.metadata) == "string"){
    resume.metadata = JSON.parse(resume.metadata);
  }
  metadata_local.value.section_dividers = resume.metadata.section_dividers ?? false;
  metadata_local.value.render_fields = resume.metadata.render_fields ?? [];
  
  // JONAH - Handle default fName. lName, phone_num, and email from user
  personalInfo.value.fName = resume.metadata.fName ?? "";
  personalInfo.value.lName = resume.metadata.lName ?? "";
  personalInfo.value.phone_number = resume.metadata.phone_number ?? "";
  personalInfo.value.email = resume.metadata.email ?? "";

  // Sort resume data based on render_fields order
  const sortedResumeData = computed(() => {
    const renderFieldsMap = new Map(metadata_local.value.render_fields.map((field, index) => [field, index]));
    return resume_data_local.value.sort((a, b) => {
      const indexA = renderFieldsMap.has(a.title.toLowerCase()) ? renderFieldsMap.get(a.title.toLowerCase()) : Infinity;
      const indexB = renderFieldsMap.has(b.title.toLowerCase()) ? renderFieldsMap.get(b.title.toLowerCase()) : Infinity;
      return indexA - indexB;
    });
  });

  resume_data_local.value = sortedResumeData.value;
  await processSectionItems();
}

async function processSectionItems() {
  // Get all resume sections and their items
  const resumeSections = await resumeSectionServices.getSectionsForResume(props.resumeId);

  if (resumeSections && resumeSections.data) {
    const fetchItemPromises = resumeSections.data.map((section) =>
      fetchSectionItems(section.section_type, props.resumeId, section.section_id)
        .then((itemsResponse) => {
          // Process the fetched items for each section
          processFetchedItemsForSection(section, itemsResponse);
        })
        .catch((err) => {
          console.error(`Error fetching items for section ${section.section_type}:`, err);
        })
    );

    // Wait for all fetch requests to resolve
    await Promise.all(fetchItemPromises);
  } else {
  }
}

async function fetchSectionItems(sectionType, resumeId, sectionId) {
  switch (sectionType) {
    case 'education':
      return await educationItemServices.getEducationItems(sectionId, resumeId);
    case 'experience':
      return await experienceItemServices.getExperienceItems(sectionId, resumeId);
    case 'project':
      return await projectItemServices.getProjectItems(sectionId, resumeId);
    case 'award':
      return await awardItemServices.getAwardItems(sectionId, resumeId);
    case 'link':
      return await linkItemServices.getLinkItems(sectionId, resumeId);
    case 'skill':
      return await skillItemServices.getSkillItems(sectionId, resumeId);
    case 'professional_summary':
      return await professionalSummaryItemServices.getProfessionalSummaryItems(sectionId, resumeId);
    default:
      return [];
  }
}

function processFetchedItemsForSection(section, itemsResponse) {
  // Processing specific section items like professional_summary, link, etc.
  if (section.section_type === "professional_summary") {
    handleProfessionalSummary(itemsResponse);
  }

  if (section.section_type === "link") {
    handleLinkItems(itemsResponse);
  }

  // Loop through resume_data_local.value to process and select items based on section type
  for (let i = 0; i < resume_data_local.value.length; i++) {
    const resumeSection = resume_data_local.value[i];

    if (resumeSection.title.toLowerCase() === section.section_type) {
      if (resumeSection.items) {
        // Create a mapping of itemIdKey to order
        const orderMap = {};
        itemsResponse.data.forEach(item => {
          const itemIdKey = getItemIdKey(resumeSection.title);
          orderMap[item[itemIdKey]] = item.order;
        });

        resumeSection.items.forEach((localItem) => {
          localItem.selected = false; // Reset selection before checking

          // Match items based on section type
          const itemIdKey = getItemIdKey(resumeSection.title);
          matchAndSelect(localItem, itemsResponse.data, itemIdKey);
        });

        // Sort resumeSection.items based on the order value
        resumeSection.items.sort((a, b) => {
          const orderA = orderMap[a.data?.id] !== undefined ? orderMap[a.data?.id] : Infinity;
          const orderB = orderMap[b.data?.id] !== undefined ? orderMap[b.data?.id] : Infinity;
          return orderA - orderB;
        });
      }
    }
  }
}

function matchAndSelect(localItem, itemsData, itemIdKey) {
  const matchingItem = itemsData.find(item => item[itemIdKey] === localItem.data?.id);
  if (matchingItem) {
    localItem.selected = true;
  }
}

function getItemIdKey(sectionTitle) {
  switch (sectionTitle) {
    case "Skill":
      return 'skill_id';
    case "Education":
      return 'education_id';
    case "Experience":
      return 'experience_id';
    case "Award":
      return 'award_id';
    case "Project":
      return 'project_id';
    default:
      return null;
  }
}
 
// when add model is submitted then render processResumeData

function handleProfessionalSummary(itemsResponse) {
  const professionalSummaryId = itemsResponse.data[0]?.professionalSummary_id;
  if (professionalSummaryId) {
    professionalSummaries.value.forEach((summary) => {
      if (summary.data.id === professionalSummaryId) {
        summary.selected = true;
        updateSummary(summary);
      }
    });
  }
}

function handleLinkItems(itemsResponse) {
  // Create a mapping of link_id to order
  const orderMap = {};
  itemsResponse.data.forEach(item => {
    orderMap[item.link_id] = item.order;
  });

  // Select the values in header_data_local if they are in the database
  header_data_local.value[0].items.forEach(headerItem => {
    if (orderMap.hasOwnProperty(headerItem.data.id)) {
      headerItem.selected = true;
    }
  });


  // Sort header_data_local.value[0].items based on the order value
  header_data_local.value[0].items.sort((a, b) => {
    const orderA = orderMap[a.data.id] !== undefined ? orderMap[a.data.id] : Infinity;
    const orderB = orderMap[b.data.id] !== undefined ? orderMap[b.data.id] : Infinity;
    return orderA - orderB;
  });
 
}

watch([resume_data_local, header_data_local, personalInfo, metadata_local, isLoaded, props, resumeTitle], () => {
  console.clear();
  handleDataChangeDebounced(); // Trigger debounced handleDataChange
}, { deep: true });

const handleDataChangeDebounced = debounce(async () => {
  await handleDataChange(); // Wait for handleDataChange to finish
  setTimeout(() => {
  }, 100);
  handleSaveResumeDebounced(); // Then trigger debounced handleSaveResume
}, 100);

const handleSaveResumeDebounced = debounce(() => {
  handleSaveResume(); // Save the resume
  // Updated last updated
}, 1000);

async function handleDataChange() {
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
    professional_Summary_id = summary.data.id;
    personalInfo.value.professional_summary = summary.summary;
  } else {
    professional_Summary_id = null;
    personalInfo.value.professional_summary = null;  
  }
};

defineExpose({
  resumeTitle
});

const handleSaveResume = async () => {
  await saveResume(props, resume_data, header_data, metadata, professional_Summary_id, resumeTitle, personalInfo);
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
                    <i style="margin-left: -10px; margin-right: 5px;"class="pi pi-verified"></i>
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
                      <v-expansion-panel-title> <i style="margin-left: -10px; margin-right: 5px;"class="pi pi-link"></i> Links </v-expansion-panel-title>
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
                <v-icon class="mr-2" style="margin-left: -10px">mdi-drag</v-icon>
                <i :class="section.icon" style="margin-right: 5px"></i>
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

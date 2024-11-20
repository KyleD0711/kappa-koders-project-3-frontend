<script setup>
import { ref, watch, onMounted, defineProps } from "vue";
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
import { string } from "@vueform/vueform";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(['dataChange']);

let resume;

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
    type: string,
    required: true,
  }
});

const resume_data_local = ref([]);
const header_data_local = ref([]);
const metadata_local = ref({});
const personalInfo = ref({
  fName: 'Jonah',
  lName: 'Veit',
  email: 'jonah@gmail.com',
  phone_number: '999-888-77777',
  professional_summary: null,
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

const getResumeData = async (id) => {
  try {
    const response = await resumeServices.getAllResumesForUser();
    if (Array.isArray(response.data)) {
      // Convert `id` to a number if necessary and find the matching object
      const resume = response.data.find((resume) => resume.id === Number(id));
      if (resume) {
        return resume;
      } else {
        console.warn("No Resume Found with ID:", id);
        return null;
      }
    } else {
      console.error("Response data is not an array:", response.data);
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
  
  if (resume) {
    resumeTitle.value = resume.name;
    resume.metadata = JSON.parse(resume.metadata); 
    metadata_local.value.section_dividers = resume.metadata.section_dividers ?? false;
    metadata_local.value.render_fields = resume.metadata.render_fields ?? [];

    // Perform additional actions with the `resume` object
  } else {
    console.warn("No resume found or error occurred.");
  }

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

  //console.log("Render Fields: " + Object.keys(resume_data));
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

defineExpose({
  resumeTitle
});

const saveResume = async () => {
  try {
    // Prepare payload for updating the resume
    const data = {
      name: resumeTitle.value,
      metadata: {
        render_fields: metadata.value.render_fields,
        section_dividers: metadata.value.section_dividers,
      },
    };

    // Update the resume
    await resumeServices.updateResume(props.resumeId, data);
    console.log("Resume updated successfully");

    // Fetch current resume sections
    const sectionResponse = await resumeSectionServices.getSectionsForResume(props.resumeId);
    const currentResumeSections = sectionResponse.data || [];
    const renderFields = metadata.value.render_fields;

    const existingSectionsMap = new Map(
      currentResumeSections.map((section) => [section.section_type, section])
    );

    const sectionsToCreate = [];
    const sectionsToUpdate = [];
    const sectionsToDelete = [];

    // Manage section creation, updates, and deletions
    renderFields.forEach((sectionType, index) => {
      const existingSection = existingSectionsMap.get(sectionType);

      if (existingSection) {
        sectionsToUpdate.push({
          ...existingSection,
          section_title: sectionType.charAt(0).toLowerCase() + sectionType.slice(1),
          order: index + 1,
        });
      } else {
        sectionsToCreate.push({
          resumeId: props.resumeId,
          section_type: sectionType,
          section_title: sectionType.charAt(0).toLowerCase() + sectionType.slice(1),
        });
      }
    });

    currentResumeSections.forEach((section) => {
      if (!renderFields.includes(section.section_type)) {
        sectionsToDelete.push(section.section_id);
      }
    });

    console.log("Sections to Create:", sectionsToCreate);
    console.log("Sections to Update:", sectionsToUpdate);
    console.log("Sections to Delete:", sectionsToDelete);

    // Handle section creation
    for (const section of sectionsToCreate) {
      const createdSection = await resumeSectionServices.createResumeSection(props.resumeId, section);
      const sectionId = createdSection.data.section_id;

      switch (section.section_title) {
        case "skill":
          console.log("Handling skill");
          const skillPromises = resume_data.value.skill.map(async (skill) => {
            console.log("Skill Name: " + skill.id);
            try {
              return await skillItemServices.createSkillItem(skill.id, sectionId, props.resumeId);
            } catch (error) {
              console.log("Error creating skill item:", error);
            }
          });
          await Promise.all(skillPromises);
          break;

        case "education":
          console.log("Handling education");
          const educationPromises = resume_data.value.education.map(async (education) => {
            try {
              return await educationItemServices.createEducationItem(education.id, sectionId, props.resumeId);
            } catch (error) {
              console.log("Error creating education item:", error);
            }
          });
          await Promise.all(educationPromises);
          break;

        case "experience":
          console.log("Handling experience");
          const experiencePromises = resume_data.value.experience.map(async (experience) => {
            try {
              return await experienceItemServices.createExperienceItem(experience.id, sectionId, props.resumeId);
            } catch (error) {
              console.log("Error creating experience item:", error);
            }
          });
          await Promise.all(experiencePromises);
          break;

        case "project":
          console.log("Handling project");
          const projectPromises = resume_data.value.project.map(async (project) => {
            try {
              return await projectItemServices.createProjectItem(project.id, sectionId, props.resumeId);
            } catch (error) {
              console.log("Error creating project item:", error);
            }
          });
          await Promise.all(projectPromises);
          break;

        case "award":
          console.log("Handling award");
          const awardPromises = resume_data.value.award.map(async (award) => {
            try {
              return await awardItemServices.createAwardItem(award.id, sectionId, props.resumeId);
            } catch (error) {
              console.log("Error creating award item:", error);
            }
          });
          await Promise.all(awardPromises);
          break;

        case "link":
          console.log("Handling link");
          const linkPromises = resume_data.value.link.map(async (link) => {
            try {
              return await linkItemServices.createLinkItem(link.id, sectionId, props.resumeId);
            } catch (error) {
              console.log("Error creating link item:", error);
            }
          });
          await Promise.all(linkPromises);
          break;

        case "professional_summary":
          console.log("Handling professional summary");
          const summaryPromises = resume_data.value.professional_summary.map(async (summary) => {
            try {
              return await professionalSummaryItemServices.createProfessionalSummaryItem(summary.id, sectionId, props.resumeId);
            } catch (error) {
              console.log("Error creating professional summary item:", error);
            }
          });
          await Promise.all(summaryPromises);
          break;

        default:
          break;
      }
    }

    // Handle section updates
    for (const section of sectionsToUpdate) {
      // Update the section
      await resumeSectionServices.updateResumeSection(props.resumeId, section.section_id, section);

      switch (section.section_title) {
        case "skill":
          console.log("Updating skills: " + section.section_id);
          const existingSkillsResponse = await skillItemServices.getSkillItems(section.section_id, props.resumeId);
          const existingSkills = existingSkillsResponse.data || [];
          const existingSkillsMap = new Map(existingSkills.map(skill => [skill.id, skill]));

          // Create a Set of new skill IDs from resume_data
          const newSkillIds = new Set(resume_data.value.skill.map(skill => skill.id));

          // Determine skills to delete
          const skillsToDelete = existingSkills.filter(skill => !newSkillIds.has(skill.id));

          // Delete unused skill items
          for (const skill of skillsToDelete) {
            await skillItemServices.deleteSkillItem(section.section_id, props.resumeId, skill.id);
            console.log(`Deleted skill item with ID: ${skill.id}`);
          }

          // Handle updating/creating new skills
          const skillPromises = resume_data.value.skill.map(async (skill) => {
            if (existingSkillsMap.has(skill.id)) {
              // Update existing skill item
              const skillItemId = existingSkillsMap.get(skill.id).id;
              return await skillItemServices.updateSkillItem(skillItemId, { skillId: skill.id, sectionId: section.section_id });
            } else {
              // Create new skill item if it does not exist
              return await skillItemServices.createSkillItem(skill.id, section.section_id, props.resumeId);
            }
          });
          await Promise.all(skillPromises);
          break;

        case "education":
          console.log("Updating education: " + section.section_id);
          // Similar logic for education
          const existingEducationResponse = await educationItemServices.getEducationItems(section.section_id, props.resumeId);
          const existingEducations = existingEducationResponse.data || [];
          const existingEducationMap = new Map(existingEducations.map(edu => [edu.id, edu]));

          const newEducationIds = new Set(resume_data.value.education.map(edu => edu.id));
          const educationsToDelete = existingEducations.filter(edu => !newEducationIds.has(edu.id));

          for (const edu of educationsToDelete) {
            await educationItemServices.deleteEducationItem(section.section_id, props.resumeId, edu.id);
            console.log(`Deleted education item with ID: ${edu.id}`);
          }

          const educationPromises = resume_data.value.education.map(async (edu) => {
            if (existingEducationMap.has(edu.id)) {
              const educationItemId = existingEducationMap.get(edu.id).id;
              return await educationItemServices.updateEducationItem(educationItemId, { ...edu, sectionId: section.section_id });
            } else {
              return await educationItemServices.createEducationItem(edu.id, section.section_id, props.resumeId);
            }
          });
          await Promise.all(educationPromises);
          break;

        case "experience":
          console.log("Updating experience: " + section.section_id);
          // Similar logic for experience
          const existingExperienceResponse = await experienceItemServices.getExperienceItems(section.section_id, props.resumeId);
          const existingExperiences = existingExperienceResponse.data || [];
          const existingExperienceMap = new Map(existingExperiences.map(exp => [exp.id, exp]));

          const newExperienceIds = new Set(resume_data.value.experience.map(exp => exp.id));
          const experiencesToDelete = existingExperiences.filter(exp => !newExperienceIds.has(exp.id));

          for (const exp of experiencesToDelete) {
            await experienceItemServices.deleteExperienceItem(section.section_id, props.resumeId, exp.id);
            console.log(`Deleted experience item with ID: ${exp.id}`);
          }

          const experiencePromises = resume_data.value.experience.map(async (exp) => {
            if (existingExperienceMap.has(exp.id)) {
              const experienceItemId = existingExperienceMap.get(exp.id).id;
              return await experienceItemServices.updateExperienceItem(experienceItemId, { ...exp, sectionId: section.section_id });
            } else {
              return await experienceItemServices.createExperienceItem(exp.id, section.section_id, props.resumeId);
            }
          });
          await Promise.all(experiencePromises);
          break;

        case "project":
          console.log("Updating project: " + section.section_id);
          // Similar logic for projects
          const existingProjectResponse = await projectItemServices.getProjectItems(section.section_id, props.resumeId);
          const existingProjects = existingProjectResponse.data || [];
          const existingProjectMap = new Map(existingProjects.map(proj => [proj.id, proj]));

          const newProjectIds = new Set(resume_data.value.project.map(proj => proj.id));
          const projectsToDelete = existingProjects.filter(proj => !newProjectIds.has(proj.id));

          for (const proj of projectsToDelete) {
            await projectItemServices.deleteProjectItem(section.section_id, props.resumeId, proj.id);
            console.log(`Deleted project item with ID: ${proj.id}`);
          }

          const projectPromises = resume_data.value.project.map(async (proj) => {
            if (existingProjectMap.has(proj.id)) {
              const projectItemId = existingProjectMap.get(proj.id).id;
              return await projectItemServices.updateProjectItem(projectItemId, { ...proj, sectionId: section.section_id });
            } else {
              return await projectItemServices.createProjectItem(proj.id, section.section_id, props.resumeId);
            }
          });
          await Promise.all(projectPromises);
          break;

        case "award":
          console.log("Updating award: " + section.section_id);
          // Similar logic for awards
          const existingAwardResponse = await awardItemServices.getAwardItems(section.section_id, props.resumeId);
          const existingAwards = existingAwardResponse.data || [];
          const existingAwardMap = new Map(existingAwards.map(award => [award.id, award]));

          const newAwardIds = new Set(resume_data.value.award.map(award => award.id));
          const awardsToDelete = existingAwards.filter(award => !newAwardIds.has(award.id));

          for (const award of awardsToDelete) {
            await awardItemServices.deleteAwardItem(section.section_id, props.resumeId, award.id);
            console.log(`Deleted award item with ID: ${award.id}`);
          }

          const awardPromises = resume_data.value.award.map(async (award) => {
            if (existingAwardMap.has(award.id)) {
              const awardItemId = existingAwardMap.get(award.id).id;
              return await awardItemServices.updateAwardItem(awardItemId, { ...award, sectionId: section.section_id });
            } else {
              return await awardItemServices.createAwardItem(award.id, section.section_id, props.resumeId);
            }
          });
          await Promise.all(awardPromises);
          break;

        case "link":
          console.log("Updating link: " + section.section_id);
          // Similar logic for links
          const existingLinkResponse = await linkItemServices.getLinkItems(section.section_id, props.resumeId);
          const existingLinks = existingLinkResponse.data || [];
          const existingLinkMap = new Map(existingLinks.map(link => [link.id, link]));

          const newLinkIds = new Set(resume_data.value.link.map(link => link.id));
          const linksToDelete = existingLinks.filter(link => !newLinkIds.has(link.id));

          for (const link of linksToDelete) {
            await linkItemServices.deleteLinkItem(section.section_id, props.resumeId, link.id);
            console.log(`Deleted link item with ID: ${link.id}`);
          }

          const linkPromises = resume_data.value.link.map(async (link) => {
            if (existingLinkMap.has(link.id)) {
              const linkItemId = existingLinkMap.get(link.id).id;
              return await linkItemServices.updateLinkItem(linkItemId, { ...link, sectionId: section.section_id });
            } else {
              return await linkItemServices.createLinkItem(link.id, section.section_id, props.resumeId);
            }
          });
          await Promise.all(linkPromises);
          break;

        case "professional_summary":
          console.log("Updating professional summary: " + section.section_id);
          // Similar logic for professional summaries
          const existingSummaryResponse = await professionalSummaryItemServices.getProfessionalSummaryItems(section.section_id, props.resumeId);
          const existingSummaries = existingSummaryResponse.data || [];
          const existingSummaryMap = new Map(existingSummaries.map(summary => [summary.id, summary]));

          const newSummaryIds = new Set(resume_data.value.professional_summary.map(summary => summary.id));
          const summariesToDelete = existingSummaries.filter(summary => !newSummaryIds.has(summary.id));

          for (const summary of summariesToDelete) {
            await professionalSummaryItemServices.deleteProfessionalSummaryItem(section.section_id, props.resumeId, summary.id);
            console.log(`Deleted professional summary item with ID: ${summary.id}`);
          }

          const summaryPromises = resume_data.value.professional_summary.map(async (summary) => {
            if (existingSummaryMap.has(summary.id)) {
              const summaryItemId = existingSummaryMap.get(summary.id).id;
              return await professionalSummaryItemServices.updateProfessionalSummaryItem(summaryItemId, { ...summary, sectionId: section.section_id });
            } else {
              return await professionalSummaryItemServices.createProfessionalSummaryItem(summary.id, section.section_id, props.resumeId);
            }
          });
          await Promise.all(summaryPromises);
          break;

        default:
          break;
      }
    }

    // Handle section deletions
    for (const sectionId of sectionsToDelete) {
      await resumeSectionServices.deleteResumeSection(props.resumeId, sectionId);
    }

    console.log("Resume sections and skill items updated successfully");
  } catch (error) {
    console.error("Error saving the resume:", error.response?.data || error.message);
    alert("Failed to save the resume. Please try again.");
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

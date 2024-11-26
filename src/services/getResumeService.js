import resumeSectionServices from "./resumeSectionServices";
import resumeServices from "./resumeServices";
import educationItemServices from "./educationItemServices";
import experienceItemServices from "./experienceItemServices";
import projectItemServices from "./projectItemServices";
import awardItemServices from "./awardItemServices";
import linkItemServices from "./linkItemServices";
import skillItemServices from "./skillItemServices";
import professionalSummaryItemServices from "./professionalSummaryItemServices";
import professionalSummaryServices from "./professionalSummaryServices";
import templateServices from "./templateServices";

export default {
  async getResume(resumeId) {
    let resume = await getResumeData(resumeId);
    let sectionData = await getSectionItems(resumeId);
    let resumeData = sectionData.resumeData;
    let professionalSummary = sectionData.professionalSummary;
    let resumeMetadata = safeParseJSON(resume.metadata);
    let headerData = getHeaderData(resumeMetadata, professionalSummary);
    let metaData = getMetaData(resumeMetadata);

    let template = await getTemplate(resume.templateId);

    return {
      resumeData,
      headerData,
      metaData,
      template,
    };
  },
};

const safeParseJSON = (jsonObj) => {
  let defaultValue = {};
  try {
    if (typeof jsonObj == "string") {
      return JSON.parse(jsonObj);
    } else {
      return jsonObj;
    }
  } catch (exception) {
    return defaultValue;
  }
};

const getMetaData = (metadata) => {
  return {
    render_fields: metadata.render_fields,
    section_dividers: metadata.section_dividers,
  };
};

const getTemplate = async (templateId) => {
  return templateServices
    .getTemplateForId(templateId)
    .then((res) => {
      return res.data.template_data;
    })
    .catch((err) => {
      return {};
    });
};

const getResumeData = async (id) => {
  return await resumeServices
    .getResumeByID(id)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return {};
    });
};

async function getSectionItems(resumeId) {
  let resumeData = {
    education: [],
    experience: [],
    award: [],
    project: [],
    skill: [],
  };

  let professionalSummary = "";

  // Get all resume sections and their items
  const resumeSections = await resumeSectionServices.getSectionsForResume(
    resumeId
  );

  if (resumeSections && resumeSections.data) {
    // Use a for...of loop to handle asynchronous calls properly
    for (const section of resumeSections.data) {
      try {
        const data = await fetchSectionItems(
          section.section_type,
          resumeId,
          section.section_id
        );

        data.data.forEach((value) => {
          let sectionName = getNameFromKey(value);
          if (
            sectionName !== "professional_summary" &&
            sectionName !== "link"
          ) {
            resumeData[sectionName].push({ ...value[sectionName] });
          } else if (sectionName === "professional_summary") {
            professionalSummary = value.professionalSummary.summary;
          }
        });
      } catch (err) {
        console.error(
          `Error fetching items for section ${section.section_type}:`,
          err
        );
      }
    }

    return { resumeData, professionalSummary };
  } else {
    console.warn("No sections found for the resume.");
    return { resumeData, professionalSummary }; // Return even if no sections are found
  }
}

function getNameFromKey(sectionData) {
  let sectionName = "";
  Object.keys(sectionData).forEach((value) => {
    switch (value) {
      case "education_id":
        sectionName = "education";
        break;
      case "award_id":
        sectionName = "award";
        break;
      case "experience_id":
        sectionName = "experience";
        break;
      case "project_id":
        sectionName = "project";
        break;
      case "skill_id":
        sectionName = "skill";
        break;
      case "professionalSummary_id":
        sectionName = "professional_summary";
        break;
      case "link":
        sectionName = "link";
        break;
    }
  });
  return sectionName;
}

// Queries the correct backend endpoint for the sectionId
async function fetchSectionItems(sectionType, resumeId, sectionId) {
  switch (sectionType) {
    case "education":
      return await educationItemServices.getEducationItems(sectionId, resumeId);
    case "experience":
      return await experienceItemServices.getExperienceItems(
        sectionId,
        resumeId
      );
    case "project":
      return await projectItemServices.getProjectItems(sectionId, resumeId);
    case "award":
      return await awardItemServices.getAwardItems(sectionId, resumeId);
    case "link":
      return await linkItemServices.getLinkItems(sectionId, resumeId);
    case "skill":
      return await skillItemServices.getSkillItems(sectionId, resumeId);
    case "professional_summary":
      return await professionalSummaryItemServices.getProfessionalSummaryItems(
        sectionId,
        resumeId
      );
    default:
      console.warn(`No service defined for section type: ${sectionType}`);
      return [];
  }
}

const getHeaderData = (metadata, professional_summary) => {
  const result = {};

  result.fName = metadata.fName || "";
  result.lName = metadata.lName || "";
  result.email = metadata.email || "";
  result.phone_number = metadata.phone_number || "";
  result.professional_summary = professional_summary || "";

  return result;
};

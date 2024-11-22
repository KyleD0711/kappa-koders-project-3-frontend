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

export default {
  async getResume(resumeId) {
    let resume = await getResumeData(resumeId);
    let resumeData = await getSectionItems(resumeId);
    let professionalSummary = await getProfessionalSummary(resumeId);
    let headerData = getHeaderData(resume.metadata, professionalSummary);
    let metaData = getMetaData(resume.metadata);

    return {
      resumeData,
      headerData,
      metaData,
    };
  },
};

const getMetaData = (metadata) => {
  return {
    render_fields: metadata.render_fields,
    section_dividers: metadata.section_dividers,
  };
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

async function getSectionItems(resumeId) {
  let resumeData = {
    education: [],
    experience: [],
    award: [],
    project: [],
    skill: [],
  };
  // Get all resume sections and their items
  const resumeSections = await resumeSectionServices.getSectionsForResume(
    resumeId
  );

  if (resumeSections && resumeSections.data) {
    await resumeSections.data.forEach(async (section) => {
      fetchSectionItems(section.section_type, resumeId, section.section_id)
        .then((data) => {
          data.data.forEach((value) => {
            let sectionName = getNameFromKey(value);
            if (
              sectionName != "professional_summary" &&
              sectionName != "link"
            ) {
              resumeData[sectionName].push({ ...value });
            }
          });
        })
        .catch((err) => {
          console.error(
            `Error fetching items for section ${section.section_type}:`,
            err
          );
        });
    });

    return resumeData;
  } else {
    console.warn("No sections found for the resume.");
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

// TODO - Need to finish this function.
const getResumeSectionForType = async (section) => {};

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

const getProfessionalSummary = async (resumeId) => {
  return await professionalSummaryServices
    .getProfessionalSummaryForResumeId(resumeId)
    .then((response) => {
      return response.data.summary;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getHeaderData = (metadata, professional_summary) => {
  const result = {};

  result.fName = metadata.fName || "";
  result.lName = metadata.lName || "";
  result.email = metadata.email || "";
  result.phone_number = metadata.phone_number || "";
  result.professional_summary = professional_summary || "";

  return result;
};

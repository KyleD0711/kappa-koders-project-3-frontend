import resumeServices from "./resumeServices";
import resumeSectionServices from "./resumeSectionServices";
import skillItemServices from "./skillItemServices";
import educationItemServices from "./educationItemServices";
import experienceItemServices from "./experienceItemServices";
import projectItemServices from "./projectItemServices";
import awardItemServices from "./awardItemServices";
import linkItemServices from "./linkItemServices";
import professionalSummaryItemServices from "./professionalSummaryItemServices";

const saveResume = async (
  props,
  resume_data,
  header_data,
  metadata,
  professional_Summary_id,
  resumeTitle,
  personalInfo
) => {
  try {
    // Prepare payload for updating the resume
    const templateId = props.templateData.substring(8);
    const data = {
        name: resumeTitle.value,
        metadata: {
            fName: personalInfo.value.fName,
            lName: personalInfo.value.lName,
            email: personalInfo.value.email,
            phone_number: personalInfo.value.phone_number,
            render_fields: metadata.value.render_fields,
            section_dividers: metadata.value.section_dividers,
        },
        templateId: templateId,
    };
    // Update the resume
    await resumeServices.updateResume(props.resumeId, data);

    // Fetch current resume sections
    const sectionResponse = await resumeSectionServices.getSectionsForResume(
      props.resumeId
    );
    const currentResumeSections = sectionResponse.data || [];
    const renderFields = metadata.value.render_fields;

    if (header_data.value.link) {
      renderFields.push("link");
    }
    if (header_data.value.professional_summary) {
      renderFields.push("professional_summary");
    }

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
          section_title:
            sectionType.charAt(0).toLowerCase() + sectionType.slice(1),
          order: index + 1,
        });
      } else {
        sectionsToCreate.push({
          resumeId: props.resumeId,
          section_type: sectionType,
          section_title:
            sectionType.charAt(0).toLowerCase() + sectionType.slice(1),
        });
      }
    });

    currentResumeSections.forEach((section) => {
      if (!renderFields.includes(section.section_type)) {
        sectionsToDelete.push(section.section_id);
      }
    });

    // console.log("Sections to Create:", sectionsToCreate);
    // console.log("Sections to Update:", sectionsToUpdate);
    // console.log("Sections to Delete:", sectionsToDelete);

    // Handle section creation
    for (const section of sectionsToCreate) {
      const createdSection = await resumeSectionServices.createResumeSection(
        props.resumeId,
        section
      );
      const sectionId = createdSection.data.section_id;

      switch (section.section_title) {
        case "skill":
          const skillPromises = resume_data.value.skill.map(async (skill) => {
            try {
              const order = resume_data.value.skill.findIndex(
                (item) => item.id === skill.id
              );
              return await skillItemServices.createSkillItem(
                skill.id,
                sectionId,
                props.resumeId,
                order
              );
            } catch (error) {
              console.log("Error creating skill item:", error);
            }
          });
          await Promise.all(skillPromises);
          break;
        case "education":
          const educationPromises = resume_data.value.education.map(
            async (education) => {
              try {
                const order = resume_data.value.education.findIndex(
                  (item) => item.id === education.id
                );
                return await educationItemServices.createEducationItem(
                  education.id,
                  sectionId,
                  props.resumeId,
                  order
                );
              } catch (error) {
                console.log("Error creating education item:", error);
              }
            }
          );
          await Promise.all(educationPromises);
          break;
        case "experience":
          const experiencePromises = resume_data.value.experience.map(
            async (experience) => {
              try {
                const order = resume_data.value.experience.findIndex(
                  (item) => item.id === experience.id
                );
                return await experienceItemServices.createExperienceItem(
                  experience.id,
                  sectionId,
                  props.resumeId,
                  order
                );
              } catch (error) {
                console.log("Error creating experience item:", error);
              }
            }
          );
          await Promise.all(experiencePromises);
          break;
        case "project":
          const projectPromises = resume_data.value.project.map(
            async (project) => {
              try {
                console.log("Save Project: ", project);
                const order = resume_data.value.project.findIndex(
                  (item) => item.id === project.id
                );
                return await projectItemServices.createProjectItem(
                  project.id,
                  sectionId,
                  props.resumeId,
                  order
                );
              } catch (error) {
                console.log("Error creating project item:", error);
              }
            }
          );
          await Promise.all(projectPromises);
          break;
        case "award":
          const awardPromises = resume_data.value.award.map(async (award) => {
            try {
              const order = resume_data.value.award.findIndex(
                (item) => item.id === award.id
              );
              return await awardItemServices.createAwardItem(
                award.id,
                sectionId,
                props.resumeId,
                order
              );
            } catch (error) {
              console.log("Error creating award item:", error);
            }
          });
          await Promise.all(awardPromises);
          break;
        case "link":
          const linkPromises = header_data.value.link.map(async (link) => {
            try {
              const order = header_data.value.link.findIndex(
                (item) => item.id === link.id
              );
              return await linkItemServices.createLinkItem(
                link.id,
                sectionId,
                props.resumeId,
                order
              );
            } catch (error) {
              console.log("Error creating link item:", error);
            }
          });
          await Promise.all(linkPromises);
          break;
        case "professional_summary":
          try {
            return await professionalSummaryItemServices.createProfessionalSummaryItem(
              professional_Summary_id,
              sectionId,
              props.resumeId
            );
          } catch (error) {
            console.log("Error creating professional summary item:", error);
          }
          break;
        default:
          break;
      }
    }

    // Handle section updates
    for (const section of sectionsToUpdate) {
      // Update the section
      await resumeSectionServices.updateResumeSection(
        props.resumeId,
        section.section_id,
        section
      );

      switch (section.section_title) {
        case "skill":
          let skill_existingSkillResponse =
            await skillItemServices.getSkillItems(
              section.section_id,
              props.resumeId
            );

          let skill_existingIds = skill_existingSkillResponse.data.map(
            (item) => item.skill_id
          );

          let skill_resumeIds = resume_data.value.skill.map((item) => item.id);
          // ids to add
          let skill_missingIds = skill_resumeIds.filter(
            (id) => !skill_existingIds.includes(id)
          );
          // ids to update
          let skill_updateIds = skill_resumeIds.filter((id) =>
            skill_existingIds.includes(id)
          );
          // ids to delete
          let skill_deleteIds = skill_existingIds.filter(
            (id) => !skill_resumeIds.includes(id)
          );

          // add
          for (const missingId of skill_missingIds) {
            const order = resume_data.value.skill.findIndex(
              (item) => item.id === missingId
            );
            await skillItemServices.createSkillItem(
              missingId,
              section.section_id,
              props.resumeId,
              order
            );
          }
          // update
          for (const updateId of skill_updateIds) {
            const order = resume_data.value.skill.findIndex(
              (item) => item.id === updateId
            );
            const matchingItem = skill_existingSkillResponse.data.find(
              (item) => item.skill_id === updateId
            );
            await skillItemServices.updateSkillItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id,
              order
            );
          }
          // delete
          for (const deleteId of skill_deleteIds) {
            const matchingItem = skill_existingSkillResponse.data.find(
              (item) => item.skill_id === deleteId
            );
            await skillItemServices.deleteSkillItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id
            );
          }
          break;
        case "education":
          let education_existingEducationResponse =
            await educationItemServices.getEducationItems(
              section.section_id,
              props.resumeId
            );

          let education_existingIds =
            education_existingEducationResponse.data.map(
              (item) => item.education_id
            );

          let education_resumeIds = resume_data.value.education.map(
            (item) => item.id
          );
          // ids to add
          let education_missingIds = education_resumeIds.filter(
            (id) => !education_existingIds.includes(id)
          );
          // ids to update
          let education_updateIds = education_resumeIds.filter((id) =>
            education_existingIds.includes(id)
          );
          // ids to delete
          let education_deleteIds = education_existingIds.filter(
            (id) => !education_resumeIds.includes(id)
          );

          // add
          for (const missingId of education_missingIds) {
            const order = resume_data.value.education.findIndex(
              (item) => item.id === missingId
            );
            await educationItemServices.createEducationItem(
              missingId,
              section.section_id,
              props.resumeId,
              order
            );
          }
          // update
          for (const updateId of education_updateIds) {
            const order = resume_data.value.education.findIndex(
              (item) => item.id === updateId
            );
            const matchingItem = education_existingEducationResponse.data.find(
              (item) => item.education_id === updateId
            );
            await educationItemServices.updateEducationItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id,
              order
            );
          }
          // delete
          for (const deleteId of education_deleteIds) {
            const matchingItem = education_existingEducationResponse.data.find(
              (item) => item.education_id === deleteId
            );
            await educationItemServices.deleteEducationItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id
            );
          }
          break;
        case "experience":
          let experience_existingExperienceResponse =
            await experienceItemServices.getExperienceItems(
              section.section_id,
              props.resumeId
            );

          let experience_existingIds =
            experience_existingExperienceResponse.data.map(
              (item) => item.experience_id
            );

          let experience_resumeIds = resume_data.value.experience.map(
            (item) => item.id
          );
          // ids to add
          let experience_missingIds = experience_resumeIds.filter(
            (id) => !experience_existingIds.includes(id)
          );
          // ids to update
          let experience_updateIds = experience_resumeIds.filter((id) =>
            experience_existingIds.includes(id)
          );
          // ids to delete
          let experience_deleteIds = experience_existingIds.filter(
            (id) => !experience_resumeIds.includes(id)
          );

          // add
          for (const missingId of experience_missingIds) {
            const order = resume_data.value.experience.findIndex(
              (item) => item.id === missingId
            );
            await experienceItemServices.createExperienceItem(
              missingId,
              section.section_id,
              props.resumeId,
              order
            );
          }
          // update
          for (const updateId of experience_updateIds) {
            const order = resume_data.value.experience.findIndex(
              (item) => item.id === updateId
            );
            const matchingItem =
              experience_existingExperienceResponse.data.find(
                (item) => item.experience_id === updateId
              );
            await experienceItemServices.updateExperienceItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id,
              order
            );
          }
          // delete
          for (const deleteId of experience_deleteIds) {
            const matchingItem =
              experience_existingExperienceResponse.data.find(
                (item) => item.experience_id === deleteId
              );
            await experienceItemServices.deleteExperienceItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id
            );
          }
          break;
        case "project":
          let project_existingProjectResponse =
            await projectItemServices.getProjectItems(
              section.section_id,
              props.resumeId
            );

          let project_existingIds = project_existingProjectResponse.data.map(
            (item) => item.project_id
          );

          let project_resumeIds = resume_data.value.project.map(
            (item) => item.id
          );
          // ids to add
          let project_missingIds = project_resumeIds.filter(
            (id) => !project_existingIds.includes(id)
          );
          // ids to update
          let project_updateIds = project_resumeIds.filter((id) =>
            project_existingIds.includes(id)
          );
          // ids to delete
          let project_deleteIds = project_existingIds.filter(
            (id) => !project_resumeIds.includes(id)
          );

          // add
          for (const missingId of project_missingIds) {
            const order = resume_data.value.project.findIndex(
              (item) => item.id === missingId
            );
            await projectItemServices.createProjectItem(
              missingId,
              section.section_id,
              props.resumeId,
              order
            );
          }
          // update
          for (const updateId of project_updateIds) {
            const order = resume_data.value.project.findIndex(
              (item) => item.id === updateId
            );
            const matchingItem = project_existingProjectResponse.data.find(
              (item) => item.project_id === updateId
            );
            await projectItemServices.updateProjectItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id,
              order
            );
          }
          // delete
          for (const deleteId of project_deleteIds) {
            const matchingItem = project_existingProjectResponse.data.find(
              (item) => item.project_id === deleteId
            );
            await projectItemServices.deleteProjectItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id
            );
          }
          break;
        case "award":
          let award_existingAwardResponse =
            await awardItemServices.getAwardItems(
              section.section_id,
              props.resumeId
            );

          let award_existingIds = award_existingAwardResponse.data.map(
            (item) => item.award_id
          );

          let award_resumeIds = resume_data.value.award.map((item) => item.id);
          // ids to add
          let award_missingIds = award_resumeIds.filter(
            (id) => !award_existingIds.includes(id)
          );
          // ids to update
          let award_updateIds = award_resumeIds.filter((id) =>
            award_existingIds.includes(id)
          );
          // ids to delete
          let award_deleteIds = award_existingIds.filter(
            (id) => !award_resumeIds.includes(id)
          );

          // add
          for (const missingId of award_missingIds) {
            const order = resume_data.value.award.findIndex(
              (item) => item.id === missingId
            );
            await awardItemServices.createAwardItem(
              missingId,
              section.section_id,
              props.resumeId,
              order
            );
          }
          // update
          for (const updateId of award_updateIds) {
            const order = resume_data.value.award.findIndex(
              (item) => item.id === updateId
            );
            const matchingItem = award_existingAwardResponse.data.find(
              (item) => item.award_id === updateId
            );
            await awardItemServices.updateAwardItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id,
              order
            );
          }
          // delete
          for (const deleteId of award_deleteIds) {
            const matchingItem = award_existingAwardResponse.data.find(
              (item) => item.award_id === deleteId
            );
            await awardItemServices.deleteAwardItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id
            );
          }
          break;
        case "link":
          let link_existingLinkResponse = await linkItemServices.getLinkItems(
            section.section_id,
            props.resumeId
          );

          let link_existingIds = link_existingLinkResponse.data.map(
            (item) => item.link_id
          );

          let link_resumeIds = header_data.value.link.map((item) => item.id);
          // ids to add
          let link_missingIds = link_resumeIds.filter(
            (id) => !link_existingIds.includes(id)
          );
          // ids to update
          let link_updateIds = link_resumeIds.filter((id) =>
            link_existingIds.includes(id)
          );
          // ids to delete
          let link_deleteIds = link_existingIds.filter(
            (id) => !link_resumeIds.includes(id)
          );

          // add
          for (const missingId of link_missingIds) {
            const order = header_data.value.link.findIndex(
              (item) => item.id === missingId
            );
            await linkItemServices.createLinkItem(
              missingId,
              section.section_id,
              props.resumeId,
              order
            );
          }
          // update
          for (const updateId of link_updateIds) {
            const order = header_data.value.link.findIndex(
              (item) => item.id === updateId
            );
            const matchingItem = link_existingLinkResponse.data.find(
              (item) => item.link_id === updateId
            );
            await linkItemServices.updateLinkItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id,
              order
            );
          }
          // delete
          for (const deleteId of link_deleteIds) {
            const matchingItem = link_existingLinkResponse.data.find(
              (item) => item.link_id === deleteId
            );
            await linkItemServices.deleteLinkItem(
              section.section_id,
              props.resumeId,
              matchingItem.item_id
            );
          }
          break;
        case "professional_summary":
          // Fetch the existing professional summary from the backend
          const existingSummaryResponse =
            await professionalSummaryItemServices.getProfessionalSummaryItems(
              section.section_id,
              props.resumeId
            );

          let itemIDToDelete = existingSummaryResponse.data[0].item_id;
          await professionalSummaryItemServices.deleteProfessionalSummaryItem(
            section.section_id,
            props.resumeId,
            itemIDToDelete
          );
          await professionalSummaryItemServices.createProfessionalSummaryItem(
            professional_Summary_id,
            section.section_id,
            props.resumeId
          );

          break;

        default:
          break;
      }
    }

    // Handle section deletions
    for (const sectionId of sectionsToDelete) {
      await resumeSectionServices.deleteResumeSection(
        props.resumeId,
        sectionId
      );
    }

    console.log("Resume sections and skill items updated successfully");
  } catch (error) {
    console.error(
      "Error saving the resume:",
      error.response?.data || error.message
    );
    alert("Failed to save the resume. Please try again.");
  }
};

export default saveResume;

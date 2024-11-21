import resumeServices from "./resumeServices";
import resumeSectionServices from "./resumeSectionServices";
import skillItemServices from "./skillItemServices";
import educationItemServices from "./educationItemServices";
import experienceItemServices from "./experienceItemServices";
import projectItemServices from "./projectItemServices";
import awardItemServices from "./awardItemServices";
import linkItemServices from "./linkItemServices";
import professionalSummaryItemServices from "./professionalSummaryItemServices";

const saveResume = async (props, resume_data, header_data, metadata, professional_Summary_id, resumeTitle, personalInfo) => {
    try {
    // Prepare payload for updating the resume
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
        // JONAH - give resume the template
    };

    
    // Update the resume
    await resumeServices.updateResume(props.resumeId, data);
    console.log(personalInfo.value.fName);

    // Fetch current resume sections
    const sectionResponse = await resumeSectionServices.getSectionsForResume(props.resumeId);
    const currentResumeSections = sectionResponse.data || [];
    const renderFields = metadata.value.render_fields;

    if (header_data.value.link){
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
            console.log(sectionId);
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
                return await educationItemServices.createEducationItem(education.id, sectionId, props.resumeId, 0);
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
            const linkPromises = header_data.value.link.map(async (link) => {
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
            try {
            console.log(header_data.value.professional_summary);
            console.log(professional_Summary_id);
            return await professionalSummaryItemServices.createProfessionalSummaryItem(professional_Summary_id, sectionId, props.resumeId);
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
            await skillItemServices.deleteSkillItem(section.section_id, props.resumeId, skill.item_id);
            console.log(`Deleted skill item with ID: ${skill.item_id}`);
            }

            // Handle updating/creating new skills
            const skillPromises = resume_data.value.skill.map(async (skill) => {
            if (existingSkillsMap.has(skill.id)) {
                // Update existing skill item
                const skillItemId = existingSkillsMap.get(skill.id).id;
                return await skillItemServices.updateSkillItem(skillItemId, { skillId: skill.item_id, sectionId: section.section_id });
            } else {
                // Create new skill item if it does not exist
                return await skillItemServices.createSkillItem(skill.id, section.section_id, props.resumeId);
            }
            });
            await Promise.all(skillPromises);
            break;
        case "education":

            console.log("Update Education");    
            const existingEducationResponse = await educationItemServices.getEducationItems(section.section_id, props.resumeId);
            console.log(existingEducationResponse.data);
            console.log(resume_data.value.education);
           

            // console.log("Updating education: " + section.section_id);
            // // Similar logic for education
            // const existingEducationResponse = await educationItemServices.getEducationItems(section.section_id, props.resumeId);

            // console.log("ALREADY IN DB");
            // const existingEducations = existingEducationResponse.data || [];
            // const existingEducationMap = new Map(existingEducations.map(edu => [edu.item_id, edu]));

            // const newEducationIds = new Set(resume_data.value.education.map(edu => edu.item_id));
            // console.log(existingEducations);
            // const educationsToDelete = existingEducations.filter(edu => !newEducationIds.has(edu.id));


            // console.log("ExistingEducationMap:");
            // console.log(existingEducationMap);
            // console.log("newEducationIds:");
            // console.log(newEducationIds);
            // console.log("educationsToDelete:");
            // console.log(educationsToDelete);


            // for (const edu of educationsToDelete) {
            //     await educationItemServices.deleteEducationItem(section.section_id, props.resumeId, edu.item_id);
            //     console.log(`Deleted education item with ID: ${edu.id}`);
            // }

            // const educationPromises = resume_data.value.education.map(async (edu) => {
            // if (existingEducationMap.has(edu.id)) {
            //     const educationItemId = existingEducationMap.get(edu.id).id;
            //     return await educationItemServices.updateExperienceItem(educationItemId, { educationId: edu.item.id, sectionId: section.section_id }, 1);
            // } else {
            //     return await educationItemServices.createEducationItem(edu.id, section.section_id, props.resumeId, 0);
            // }
            // });
            // await Promise.all(educationPromises);
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
            console.log(exp);
            await experienceItemServices.deleteExperienceItem(section.section_id, props.resumeId, exp.item_id);
            console.log(`Deleted experience item with ID: ${exp.id}`);
            }

            const experiencePromises = resume_data.value.experience.map(async (exp) => {
            if (existingExperienceMap.has(exp.id)) {
                console.log(exp);
                const experienceItemId = existingExperienceMap.get(exp.id).id;
                return await experienceItemServices.updateEducationItem(experienceItemId, { expreinceId: exp.item.id, sectionId: section.section_id });
            } else {
                console.log(exp);
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
            await projectItemServices.deleteProjectItem(section.section_id, props.resumeId, proj.item_id);
            console.log(`Deleted project item with ID: ${proj.id}`);
            }

            const projectPromises = resume_data.value.project.map(async (proj) => {
            if (existingProjectMap.has(proj.id)) {
                const projectItemId = existingProjectMap.get(proj.id).id;
                return await projectItemServices.updateProjectItem(projectItemId, { projectId: proj.item.id, sectionId: section.section_id });
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
            await awardItemServices.deleteAwardItem(section.section_id, props.resumeId, award.item_id);
            console.log(`Deleted award item with ID: ${award.id}`);
            }

            const awardPromises = resume_data.value.award.map(async (award) => {
            if (existingAwardMap.has(award.id)) {
                const awardItemId = existingAwardMap.get(award.id).id;
                return await awardItemServices.updateAwardItem(awardItemId, { awardId: award.item.id, sectionId: section.section_id });
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

            const newLinkIds = new Set(header_data.value.link.map(link => link.id));
            const linksToDelete = existingLinks.filter(link => !newLinkIds.has(link.id));

            for (const link of linksToDelete) {
            await linkItemServices.deleteLinkItem(section.section_id, props.resumeId, link.item_id);
            console.log(`Deleted link item with ID: ${link.id}`);
            }

            const linkPromises = header_data.value.link.map(async (link) => {
            if (existingLinkMap.has(link.id)) {
                const linkItemId = existingLinkMap.get(link.id).id;
                return await linkItemServices.updateLinkItem(linkItemId, { linkId: link.item.id, sectionId: section.section_id });
            } else {
                return await linkItemServices.createLinkItem(link.id, section.section_id, props.resumeId);
            }
            });
            await Promise.all(linkPromises);
            break;
        case "professional_summary":
            console.log("Updating professional summary: " + section.section_id);

            // Fetch the existing professional summary from the backend
            const existingSummaryResponse = await professionalSummaryItemServices.getProfessionalSummaryItems(section.section_id, props.resumeId);

            let itemIDToDelete = existingSummaryResponse.data[0].item_id;
            console.log(itemIDToDelete);
            await professionalSummaryItemServices.deleteProfessionalSummaryItem(section.section_id, props.resumeId, itemIDToDelete);
            await professionalSummaryItemServices.createProfessionalSummaryItem(professional_Summary_id, section.section_id, props.resumeId);

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

export default saveResume;

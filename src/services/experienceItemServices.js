import apiClient from "./services.js";

export default {
    // Create a new ExperienceItem
    createExperienceItem(experience_id, sectionId, resumeId) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/`, { experience_id });
    },

    // Get all ExperienceItems for a specific section
    getExperienceItems(sectionId, resumeId) {
        console.log(sectionId);
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/`);
    },

    // Get a specific ExperienceItem by ID
    getExperienceItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/${itemId}`);
    },

    // Update a ExperienceItem by ID
    updateExperienceItem(sectionId, resumeId, itemId, data) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/${itemId}`, data);
    },

    // Delete a ExperienceItem by ID
    deleteExperienceItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/${itemId}`);
    },
};
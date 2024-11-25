import apiClient from "./services.js";

export default {
    // Create a new ExperienceItem
    createExperienceItem(experience_id, sectionId, resumeId, order) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/`, { experience_id, order });
    },

    // Get all ExperienceItems for a specific section
    getExperienceItems(sectionId, resumeId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/`);
    },

    // Get a specific ExperienceItem by ID
    getExperienceItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/${itemId}`);
    },

    // Update a ExperienceItem by ID
    updateExperienceItem(sectionId, resumeId, itemId, order) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/${itemId}`, {order});
    },

    // Delete a ExperienceItem by ID
    deleteExperienceItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/experience-item/${itemId}`);
    },
};
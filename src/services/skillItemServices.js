import apiClient from "./services.js";

export default {
    // Create a new SkillItem
    createSkillItem(skill_id, sectionId, resumeId) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/`, { skill_id });
    },

    // Get all SkillItems for a specific section
    getSkillItems(sectionId, resumeId) {
        console.log(sectionId);
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/`);
    },

    // Get a specific SkillItem by ID
    getSkillItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/${itemId}`);
    },

    // Update a SkillItem by ID
    updateSkillItem(sectionId, resumeId, itemId, data) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/${itemId}`, data);
    },

    // Delete a SkillItem by ID
    deleteSkillItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/${itemId}`);
    },
};
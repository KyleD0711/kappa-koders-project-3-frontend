import apiClient from "./services.js";

export default {
    // Create a new SkillItem
    createSkillItem(skill_id, sectionId, resumeId, order) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/`, { skill_id, order });
    },

    // Get all SkillItems for a specific section
    getSkillItems(sectionId, resumeId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/`);
    },

    // Get a specific SkillItem by ID
    getSkillItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/${itemId}`);
    },

    // Update a SkillItem by ID
    updateSkillItem(sectionId, resumeId, itemId, order) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/${itemId}`, {order});
    },

    // Delete a SkillItem by ID
    deleteSkillItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/skill-item/${itemId}`);
    },
};
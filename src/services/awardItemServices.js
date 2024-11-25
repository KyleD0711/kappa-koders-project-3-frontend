import apiClient from "./services.js";

export default {
    // Create a new AwardItem
    createAwardItem(award_id, sectionId, resumeId, order) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/`, { award_id, order});
    },

    // Get all AwardItems for a specific section
    getAwardItems(sectionId, resumeId) {
        console.log(sectionId);
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/`);
    },

    // Get a specific AwardItem by ID
    getAwardItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/${itemId}`);
    },

    // Update a AwardItem by ID
    updateAwardItem(sectionId, resumeId, itemId, order) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/${itemId}`, {order});
    },

    // Delete a AwardItem by ID
    deleteAwardItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/${itemId}`);
    },
};
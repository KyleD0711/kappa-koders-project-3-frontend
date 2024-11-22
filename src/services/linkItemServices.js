import apiClient from "./services.js";

export default {
    // Create a new LinkItem
    createLinkItem(link_id, sectionId, resumeId, order) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/link-item/`, { link_id, order });
    },

    // Get all LinkItems for a specific section
    getLinkItems(sectionId, resumeId) {
        console.log(sectionId);
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/link-item/`);
    },

    // Get a specific LinkItem by ID
    getLinkItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/link-item/${itemId}`);
    },

    // Update a LinkItem by ID
    updateLinkItem(sectionId, resumeId, itemId, order) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/link-item/${itemId}`, {order});
    },

    // Delete a LinkItem by ID
    deleteLinkItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/link-item/${itemId}`);
    },
};
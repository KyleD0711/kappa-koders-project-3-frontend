import apiClient from "./services.js";

export default {
    // Create a new EducationItem
    createEducationItem(education_id, sectionId, resumeId, order) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/`, { education_id, order },);
    },

    // Get all EducationItems for a specific section
    getEducationItems(sectionId, resumeId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/`);
    },

    // Get a specific EducationItem by ID
    getEducationItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/${itemId}`);
    },

    // Update a EducationItem by ID
    updateEducationItem(sectionId, resumeId, itemId, order) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/${itemId}`, {order});
    },

    // Delete a EducationItem by ID
    deleteEducationItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/${itemId}`);
    },
};
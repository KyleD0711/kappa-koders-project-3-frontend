import apiClient from "./services.js";

export default {
    // Create a new EducationItem
    createEducationItem(education_id, sectionId, resumeId, order) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/`, { education_id, order },);
    },

    // Get all EducationItems for a specific section
    getEducationItems(sectionId, resumeId) {
        console.log(sectionId);
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/`);
    },

    // Get a specific EducationItem by ID
    getEducationItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/${itemId}`);
    },

    // Update a EducationItem by ID
    updateEducationItem(sectionId, resumeId, itemId, data) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/${itemId}`, data);
    },

    // Delete a EducationItem by ID
    deleteEducationItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/education-item/${itemId}`);
    },
};
import apiClient from "./services.js";

export default {
    // Create a new ProjectItem
    createProjectItem(project_id, sectionId, resumeId) {
        return apiClient.post(`/student/resume/${resumeId}/resumeSection/${sectionId}/project-item/`, { project_id });
    },

    // Get all ProjectItems for a specific section
    getProjectItems(sectionId, resumeId) {
        console.log(sectionId);
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/project-item/`);
    },

    // Get a specific ProjectItem by ID
    getProjectItem(sectionId, resumeId, itemId) {
        return apiClient.get(`/student/resume/${resumeId}/resumeSection/${sectionId}/project-item/${itemId}`);
    },

    // Update a ProjectItem by ID
    updateProjectItem(sectionId, resumeId, itemId, data) {
        return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}/project-item/${itemId}`, data);
    },

    // Delete a ProjectItem by ID
    deleteProjectItem(sectionId, resumeId, itemId) {
        return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}/project-item/${itemId}`);
    },
};
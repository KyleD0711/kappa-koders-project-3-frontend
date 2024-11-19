import apiClient from "./services.js";
export default {
  // Get all sections for a specific resume
  getSectionsForResume(resumeId) {
    return apiClient.get(`/student/resume/${resumeId}/resumeSection`);
  },

  // Create a new resume section
  createResumeSection(resumeId, sectionData) {
    console.log("Frontend call");
    return apiClient.post(`/student/resume/${resumeId}/resumeSection`, sectionData);
  },

  // Update an existing resume section
  updateResumeSection(resumeId, sectionId, sectionData) {
    return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}`, sectionData);
  },

  // Delete a resume section
  deleteResumeSection(resumeId, sectionId) {
    return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}`);
  },
};

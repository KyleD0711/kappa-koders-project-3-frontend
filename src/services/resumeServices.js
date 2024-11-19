import apiClient from "./services.js"; // Ensure your apiClient is correctly imported

export default {
  // Get all sections for a specific resume
  getSectionsForResume(resumeId) {
    console.log("Frontend call to get sections for resume ID:", resumeId);
    return apiClient.get(`/student/resume/${resumeId}/resumeSection`);
  },

  // Create a new resume section
  createResumeSection(resumeId, sectionData) {
    console.log("Frontend call to create a new resume section");
    return apiClient.post(`/student/resume/${resumeId}/resumeSection`, sectionData);
  },

  // Update an existing resume section
  updateResumeSection(resumeId, sectionId, sectionData) {
    console.log("Frontend call to update resume section");
    return apiClient.put(`/student/resume/${resumeId}/resumeSection/${sectionId}`, sectionData);
  },

  // Delete a resume section
  deleteResumeSection(resumeId, sectionId) {
    console.log("Frontend call to delete resume section");
    return apiClient.delete(`/student/resume/${resumeId}/resumeSection/${sectionId}`);
  },

  // Create a new resume
  createResume(resumeData) {
    console.log("Frontend call to create a new resume");
    return apiClient.post(`/student/resume`, resumeData);
  },

  // Get a specific resume by ID
  getResume(resumeId) {
    console.log("Frontend call to get resume by ID:", resumeId);
    return apiClient.get(`/student/resume/${resumeId}`);
  },

  // Update a specific resume
  updateResume(resumeId, resumeData) {
    console.log("Frontend call to update resume");
    return apiClient.put(`/student/resume/${resumeId}`, resumeData);
  },

  // Delete a resume
  deleteResume(resumeId) {
    console.log("Frontend call to delete resume");
    return apiClient.delete(`/student/resume/${resumeId}`);
  }
};

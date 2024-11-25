import apiClient from "./services.js";
export default {
  // Get all sections for a specific resume
  getSectionsForResume(resumeId) {
    return apiClient.get(`/student/resume/${resumeId}/resumeSection/`);
  },

  getSectionsForResumeWithCommentsForReview(resumeId, reviewId) {
    return apiClient.get(
      `/student/resume/${resumeId}/resumeSection/comment/${reviewId}`
    );
  },

  // Get a specific section by ID
  getSectionById(resumeId, sectionId) {
    return apiClient.get(
      `/student/resume/${resumeId}/resumeSection/${sectionId}`
    );
  },

  // Create a new resume section
  createResumeSection(resumeId, sectionData) {
    return apiClient.post(
      `/student/resume/${resumeId}/resumeSection`,
      sectionData
    );
  },

  // Update an existing resume section
  updateResumeSection(resumeId, sectionId, sectionData) {
    return apiClient.put(
      `/student/resume/${resumeId}/resumeSection/${sectionId}`,
      sectionData
    );
  },

  // Delete a resume section
  deleteResumeSection(resumeId, sectionId) {
    return apiClient.delete(
      `/student/resume/${resumeId}/resumeSection/${sectionId}`
    );
  },
};

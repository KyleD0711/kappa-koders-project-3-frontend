import apiClient from "./services.js";

export default {
  // Create a new ProfessionalSummaryItem
  createProfessionalSummaryItem(professionalSummary_id, sectionId, resumeId) {
    return apiClient.post(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/professionalSummary-item/`,
      { professionalSummary_id }
    );
  },

  getProfessionalSummaryItemsForResume(resumeId) {
    return apiClient.get(
      `/student/resume/${resumeId}/professionalSummary-item`
    );
  },

  // Get all ProfessionalSummaryItems for a specific section
  getProfessionalSummaryItems(sectionId, resumeId) {
    console.log(sectionId);
    return apiClient.get(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/professionalSummary-item/`
    );
  },

  // Get a specific ProfessionalSummaryItem by ID
  getProfessionalSummaryItem(sectionId, resumeId, itemId) {
    return apiClient.get(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/professionalSummary-item/${itemId}`
    );
  },

  // Update a ProfessionalSummaryItem by ID
  updateProfessionalSummaryItem(sectionId, resumeId, itemId, data) {
    return apiClient.put(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/professionalSummary-item/${itemId}`,
      data
    );
  },

  // Delete a ProfessionalSummaryItem by ID
  deleteProfessionalSummaryItem(sectionId, resumeId, itemId) {
    return apiClient.delete(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/professionalSummary-item/${itemId}`
    );
  },
};

import apiClient from "./services.js";

export default {
  // Create a new AwardItem
  createAwardItem(award_id, sectionId, resumeId) {
    return apiClient.post(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/`,
      { award_id }
    );
  },

  // Get all AwardItems for a specific section
  getAwardItems(sectionId, resumeId) {
    return apiClient.get(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/`
    );
  },

  // Get a specific AwardItem by ID
  getAwardItem(sectionId, resumeId, itemId) {
    return apiClient.get(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/${itemId}`
    );
  },

  // Update a AwardItem by ID
  updateAwardItem(sectionId, resumeId, itemId, data) {
    return apiClient.put(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/${itemId}`,
      data
    );
  },

  // Delete a AwardItem by ID
  deleteAwardItem(sectionId, resumeId, itemId) {
    return apiClient.delete(
      `/student/resume/${resumeId}/resumeSection/${sectionId}/award-item/${itemId}`
    );
  },
};
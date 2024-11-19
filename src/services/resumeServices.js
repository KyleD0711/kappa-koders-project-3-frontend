import apiClient from "./services.js";

export default {
  getReview(reviewId) {
    return apiClient.get(`/admin/resume/review/${reviewId}`);
  },
  createReview(resumeId) {
    return apiClient.post(`/resume/${resumeId}/review`);
  },
  updateReview(reviewId, review) {
    return apiClient.put(`/admin/resume/review/${reviewId}`, review);
  },
  deleteResume(resumeId) {
    return apiClient.delete("/student/resume/" + resumeId);
  },
};

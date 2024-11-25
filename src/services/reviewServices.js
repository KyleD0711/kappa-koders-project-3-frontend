import apiClient from "./services.js";
export default {
  getReview(reviewId) {
    return apiClient.get(`/admin/resume/review/${reviewId}`);
  },
  updateReview(reviewId, review) {
    return apiClient.put(`/admin/resume/review/${reviewId}`, review);
  },
  getReviewsForResume(resumeId) {
    return apiClient.get(`/student/resume/${resumeId}/review`);
  },
  startReview(resumeId) {
    return apiClient.post(`/student/resume/${resumeId}/review`);
  },
};

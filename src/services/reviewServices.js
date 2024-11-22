import apiClient from "./services.js";
export default {
  getReview(reviewId) {
    return apiClient.get(`/admin/resume/review/${reviewId}`);
  },
};

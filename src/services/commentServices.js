import apiClient from "./services";
export default {
  getAll(reviewId) {
    return apiClient.get(`/resume/review/${reviewId}/comment`);
  },
  createComment(reviewId, comment) {
    return apiClient.post(`/admin/resume/review/${reviewId}/comment`, comment);
  },
  updateComment(commentId, comment) {
    return apiClient.put(`/admin/resume/review/comment/${commentId}`, comment);
  },
  deleteComment(commentId) {
    return apiClient.delete(`/admin/resume/review/comment/${commentId}`);
  },
};

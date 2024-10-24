import apiClient from "./services.js";

export default {
  getAllLessons(tutorialId) {
    return apiClient.get(`/tutorials/${tutorialId}/lessons`);
  },
  getLesson(tutorialId, id) {
    return apiClient.get(`/tutorials/${tutorialId}/lessons/${id}`);
  },
  createLesson(tutorialId, data) {
    return apiClient.post(`/tutorials/${tutorialId}/lessons`, data);
  },
  updateLesson(tutorialId, id, data) {
    return apiClient.put(`/tutorials/${tutorialId}/lessons/${id}`, data);
  },
  deleteLesson(tutorialId, id) {
    return apiClient.delete(`/tutorials/${tutorialId}/lessons/${id}`);
  },
};

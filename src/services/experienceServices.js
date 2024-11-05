import apiClient from "./services.js";
export default {
  getAllExperienceForUser() {
    return apiClient.get("/student/experience");
  },
  deleteExperience(id) {
    return apiClient.delete(`/student/experience/${id}`);
  },
  createExperience(item) {
    return apiClient.post(`/student/experience`, item);
  },
  updateExperience(item) {
    return apiClient.put(`/student/experience/${item.id}`, item);
  },
};

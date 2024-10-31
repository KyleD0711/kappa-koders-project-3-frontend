import apiClient from "./services.js";
export default {
  getAllExperienceForUser() {
    return apiClient.get("/user/experience");
  },
  deleteExperience(id) {
    return apiClient.delete(`/user/experience/${id}`);
  },
  createExperience(item) {
    return apiClient.post(`/user/experience`, item);
  },
  updateExperience(item) {
    return apiClient.put(`/user/experience/${item.id}`, item);
  },
};

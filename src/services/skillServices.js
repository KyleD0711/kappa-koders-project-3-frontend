import apiClient from "./services.js";
export default {
  getAllSkillForUser() {
    return apiClient.get("/student/skill");
  },
  deleteSkill(id) {
    return apiClient.delete(`/student/skill/${id}`);
  },
  createSkill(item) {
    return apiClient.post(`/student/skill`, item);
  },
  updateSkill(item) {
    return apiClient.put(`/student/skill/${item.id}`, item);
  },
};

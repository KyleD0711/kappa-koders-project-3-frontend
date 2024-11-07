import apiClient from "./services.js";
export default {
  getAllProjectForUser() {
    return apiClient.get("/student/project");
  },
  deleteProject(id) {
    return apiClient.delete(`/student/project/${id}`);
  },
  createProject(item) {
    return apiClient.post(`/student/project`, item);
  },
  updateProject(item) {
    return apiClient.put(`/student/project/${item.id}`, item);
  },
};

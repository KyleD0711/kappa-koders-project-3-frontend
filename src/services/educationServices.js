import apiClient from "./services.js";
export default {
  getAllEducationForUser() {
    return apiClient.get("/student/education");
  },
  deleteEducation(id) {
    return apiClient.delete(`/student/education/${id}`);
  },
  createEducation(item) {
    return apiClient.post(`/student/education`, item);
  },
  updateEducation(item) {
    return apiClient.put(`/student/education/${item.id}`, item);
  },
};

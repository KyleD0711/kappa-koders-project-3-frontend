import apiClient from "./services.js";
export default {
  getAllEducationForUser() {
    return apiClient.get("/user/education");
  },
  deleteEducation(id) {
    return apiClient.delete(`/user/education/${id}`);
  },
  createEducation(item) {
    return apiClient.post(`/user/education`, item);
  },
  updateEducation(item) {
    return apiClient.put(`/user/education/${item.id}`, item);
  },
};

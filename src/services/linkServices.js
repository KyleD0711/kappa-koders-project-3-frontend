import apiClient from "./services.js";
export default {
  getAllLinkForUser() {
    return apiClient.get("/student/education");
  },
  deleteLink(id) {
    return apiClient.delete(`/student/education/${id}`);
  },
  createLink(item) {
    return apiClient.post(`/student/education`, item);
  },
  updateLink(item) {
    return apiClient.put(`/student/education/${item.id}`, item);
  },
};

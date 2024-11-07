import apiClient from "./services.js";
export default {
  getAllLinkForUser() {
    return apiClient.get("/student/link");
  },
  deleteLink(id) {
    return apiClient.delete(`/student/link/${id}`);
  },
  createLink(item) {
    return apiClient.post(`/student/link`, item);
  },
  updateLink(item) {
    return apiClient.put(`/student/link/${item.id}`, item);
  },
};

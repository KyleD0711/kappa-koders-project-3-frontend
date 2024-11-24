import apiClient from "./services.js";
export default {
  getAllUser() {
    return apiClient.get("/user");
  },
  deleteUser(id) {
    return apiClient.delete(`/user/${id}`);
  },
  createUser(item) {
    return apiClient.post(`/user`, item);
  },
  updateUser(item) {
    return apiClient.put(`/user/${item.id}`, item);
  },
};

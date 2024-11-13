import apiClient from "./services.js";
export default {
  getAllAwards() {
    return apiClient.get("/student/award");
  },
  deleteAward(id) {
    return apiClient.delete(`/student/award/${id}`);
  },
  createAward(item) {
    return apiClient.post(`/student/award`, item);
  },
  updateAward(item) {
    return apiClient.put(`/student/award/${item.id}`, item);
  },
};



import apiClient from "./services.js";
export default {
  getTemplateForId(id) {
    return apiClient.get(`/student/template/${id}`);
  },
};
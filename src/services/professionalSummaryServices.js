import apiClient from "./services.js";
export default {
  getAllProfessionalSummaryForUser() {
    return apiClient.get("/student/professionalsummary");
  },
  getProfessionalSummaryById(id) {
    return apiClient.get(`/student/professionalsummary/${id}`);
  },
  deleteProfessionalSummary(id) {
    return apiClient.delete(`/student/professionalsummary/${id}`);
  },
  createProfessionalSummary(item) {
    return apiClient.post(`/student/professionalsummary`, item);
  },
  updatProfessionalSummary(item) {
    return apiClient.put(`/student/professionalsummary/${item.id}`, item);
  },
  getProfessionalSummaryForResumeId(resumeId) {
    return apiClient.get(`/student/professionalsummary/resume/${resumeId}`);
  },
};

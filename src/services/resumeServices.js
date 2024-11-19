import apiClient from "./services.js";
export default {
  createResume(data) {
    return apiClient.post('/student/resume/', data)
  },
  getAllResumesForUser() {
    return apiClient.get("/student/resume/");
  },
  deleteResume(resumeId) {
    return apiClient.delete("/student/resume/" + resumeId)
  }
};

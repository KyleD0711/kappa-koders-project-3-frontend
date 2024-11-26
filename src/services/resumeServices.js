import apiClient from "./services.js";
export default {
  createResume(data) {
    return apiClient.post('/student/resume/', data)
  },
  getAllResumesForUser() {
    return apiClient.get("/student/resume/");
  },
  getResumeByID(resumeId) {
    return apiClient.get(`/student/resume/${resumeId}`);
  },
  getAllResumesForReview(searchString) {
    return apiClient.get(`/admin/resume${searchString ? '?search=' + searchString : ''}`);
  },
  deleteResume(resumeId) {
    return apiClient.delete("/student/resume/" + resumeId)
  },
  updateResume(resumeId, data) {
    return apiClient.put(`/student/resume/${resumeId}`, data);
  },
  getResumeSections(resumeId) {
    // New method to fetch sections for a specific resume
    return apiClient.get(`/student/resume/${resumeId}/resumeSection`);
  },
};


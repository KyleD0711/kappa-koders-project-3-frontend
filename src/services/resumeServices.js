import apiClient from "./services.js";
export default {
  getAllResumesForUser() {
    return apiClient.get("/student/resume/");
  },
};

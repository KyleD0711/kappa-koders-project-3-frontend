import apiClient from "./services.js";

export default {
  // Get all skillItems
  getAllSkillItems() {
    return apiClient.get("/student/skill-item");
  },

  // Delete a skillItem by ID
  deleteSkillItem(id) {
    return apiClient.delete(`/student/skill-item/${id}`);
  },

  // Create a new skillItem
  createSkillItem(item) {
    return apiClient.post("/student/skill-item", item);
  },

  // Update an existing skillItem
  updateSkillItem(item) {
    return apiClient.put(`/student/skill-item/${item.id}`, item);
  },
};

import apiClient from "./services";

export default {
  getAllRolesForUser(userId) {
    return apiClient.get(`user/user/`);
  },
};

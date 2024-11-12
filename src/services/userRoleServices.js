import apiClient from "./services";

export default {
  getAllRolesForUser(userId) {

    return apiClient.get(`userrole/user/${userId}`);
  },
};

import apiClient from "./services";

export default {
  getAllRolesForUser(userId) {
    console.log("FETCHING ROLES");
    return apiClient.get(`userrole/user/${userId}`);
  },
};

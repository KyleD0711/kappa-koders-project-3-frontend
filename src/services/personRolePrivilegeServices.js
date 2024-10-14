import apiClient from "@/services/services.js";

export default {
  ///Persons CRUD commands
  getAllPrivileges() {
    return apiClient.get("personroleprivilege");
  },
  getPrivilege(id) {
    return apiClient.get("personroleprivilege/" + id);
  },
  getPrivilegeByPersonRole(personroleId) {
    return apiClient.get("personroleprivilege/personrole/" + personroleId);
  },
  addPrivilege(personroleprivilege) {
    return apiClient.post("personroleprivilege", personroleprivilege);
  },
  updatePrivilege(personRolePrivilegeId, personroleprivilege) {
    return apiClient.put(
      "personroleprivilege/" + personRolePrivilegeId,
      personroleprivilege
    );
  },
  deletePrivilegesForPersonRole(personRoleId) {
    return apiClient.delete("personroleprivilege/personRole/" + personRoleId);
  },
  deletePrivilege(personRolePrivilegeId) {
    return apiClient.delete("personroleprivilege/" + personRolePrivilegeId);
  },
};

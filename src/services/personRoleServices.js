import apiClient from "@/services/services.js";

export default {
  ///Personrole CRUD commands
  getAllPersonRoles() {
    return apiClient.get("personrole");
  },
  getGroupForPersonRole(id) {
    return apiClient.get("personrole/group/" + id);
  },
  getPersonRole(id) {
    return apiClient.get("personrole/" + id);
  },
  getOneForType(personId, roleId) {
    return apiClient.get("personrole/person/" + personId + "/role/" + roleId);
  },
  getAllForPerson(id) {
    return apiClient.get("personrole/person/" + id);
  },
  addPersonRole(personrole) {
    return apiClient.post("personrole", personrole);
  },
  updatePersonRole(personRoleId, personrole) {
    return apiClient.put("personrole/" + personRoleId, personrole);
  },
  disablePersonRole(personrole) {
    return apiClient.post("personrole/disable", personrole);
  },
  deletePersonRole(personRoleId) {
    return apiClient.delete("personrole/" + personRoleId);
  },
};

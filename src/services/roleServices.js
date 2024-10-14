import apiClient from "@/services/services.js";

export default {
  ///Roles CRUD commands
  getAllRoles() {
    return apiClient.get("role");
  },
  getRoles(start, length) {
    return apiClient.get(`roles?start=${start}&length=${length}`);
  },
  getAllForGroup(id) {
    return apiClient.get("role/group/" + id);
  },
  getAllForGroupByType(id, type) {
    return apiClient.get("role/group/" + id + "/type/" + type);
  },
  getRoleForPerson(id) {
    return apiClient.get("role/person/" + id);
  },
  getRoleByGroupForPerson(groupId, personId) {
    return apiClient.get("role/group/" + groupId + "/person/" + personId);
  },
  getIncompleteRoleForPerson(id) {
    return apiClient.get("role/personIn/" + id);
  },
  getRole(id) {
    return apiClient.get("role/" + id);
  },
  addRole(role) {
    return apiClient.post("role", role);
  },
  updateRole(roleId, role) {
    return apiClient.put("role/" + roleId, role);
  },
  deleteRole(roleId) {
    return apiClient.delete("role/" + roleId);
  },
};

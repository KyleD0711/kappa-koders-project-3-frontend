import apiClient from "@/services/services.js";

export default {
  ///Groups CRUD commands
  getAllGroups() {
    return apiClient.get("group");
  },
  getGroups(start, length) {
    return apiClient.get(`groups?start=${start}&length=${length}`);
  },
  getGroup(id) {
    return apiClient.get("group/" + id);
  },
  getGroupByName(name) {
    return apiClient.get("group/name/" + name);
  },
  getGroupsForPerson(id) {
    return apiClient.get("group/person/" + id);
  },
  getActiveGroupsForPerson(id) {
    return apiClient.get("group/active/person/" + id);
  },
  getContractsNeededForPerson(id) {
    return apiClient.get("group/personNeedContracts/" + id);
  },
  getTopicsNeededForTutor(id) {
    return apiClient.get("group/personNeedTopics/" + id);
  },
  addGroup(group) {
    return apiClient.post("group", group);
  },
  updateGroup(groupId, group) {
    return apiClient.put("group/" + groupId, group);
  },
  deleteGroup(groupId) {
    return apiClient.delete("group/" + groupId);
  },
};

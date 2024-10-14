import apiClient from "@/services/services.js";

export default {
  //Person topics CRUD commands
  getAllPersonTopics() {
    return apiClient.get("persontopic");
  },
  getPersonTopic(id) {
    return apiClient.get("persontopic/" + id);
  },
  getAllForPerson(id) {
    return apiClient.get("persontopic/person/" + id);
  },
  getTopicForPersonGroup(groupId, personId) {
    return apiClient.get(
      "persontopic/group/" + groupId + "/person/" + personId
    );
  },
  addPersonTopic(persontopic) {
    return apiClient.post("persontopic", persontopic);
  },
  updatePersonTopic(personTopicId, persontopic) {
    return apiClient.put("persontopic/" + personTopicId, persontopic);
  },
  deletePersonTopicByTopicId(topicId) {
    return apiClient.delete("persontopic/topic/" + topicId);
  },
  deletePersonTopicsForPersonForGroup(personId, groupId) {
    return apiClient.delete(
      "persontopic/person/" + personId + "/group/" + groupId
    );
  },
  deletePersonTopic(personTopicId) {
    return apiClient.delete("persontopic/" + personTopicId);
  },
};

import apiClient from "@/services/services.js";

export default {
  ///Topics CRUD commands
  getAllTopics() {
    return apiClient.get("topic");
  },
  getTopics(start, length) {
    return apiClient.get(`topics?start=${start}&length=${length}`);
  },
  getAllForGroup(id) {
    return apiClient.get("topic/group/" + id);
  },
  getActiveForGroup(id) {
    return apiClient.get("topic/active/group/" + id);
  },
  getTopicForPerson(id) {
    return apiClient.get("topic/person/" + id);
  },
  getHoursPerTopic(groupId, currWeek) {
    return apiClient.get("topic/group/" + groupId + "/hours/week/" + currWeek);
  },
  getTopicByGroupForPerson(groupId, personId) {
    return apiClient.get("topic/group/" + groupId + "/person/" + personId);
  },
  getTopic(id) {
    return apiClient.get("topic/" + id);
  },
  addTopic(topic) {
    return apiClient.post("topic", topic);
  },
  updateTopic(topicId, topic) {
    return apiClient.put("topic/" + topicId, topic);
  },
  deleteTopic(topicId) {
    return apiClient.delete("topic/" + topicId);
  },
};

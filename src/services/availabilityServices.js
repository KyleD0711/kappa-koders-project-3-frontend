import apiClient from "@/services/services.js";

export default {
  ///Availabilitys CRUD commands
  getAllAvailabilities() {
    return apiClient.get("availability");
  },
  getAllForGroup(id) {
    return apiClient.get("availability/group/" + id);
  },
  getAvailabilities(start, length) {
    return apiClient.get(`availabilitys?start=${start}&length=${length}`);
  },
  getAvailability(id) {
    return apiClient.get("availability/" + id);
  },
  getPersonAvailability(id) {
    return apiClient.get("availability/person/" + id);
  },
  getUpcomingForPerson(personId) {
    return apiClient.get("availability/upcoming/person/" + personId);
  },
  addAvailability(availability) {
    return apiClient.post("availability", availability);
  },
  updateAvailability(availabilityId, availability) {
    return apiClient.put("availability/" + availabilityId, availability);
  },
  deleteAvailability(availabilityId) {
    return apiClient.delete("availability/" + availabilityId);
  },
};

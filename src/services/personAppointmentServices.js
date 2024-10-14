import apiClient from "@/services/services.js";

export default {
  getAllPersonAppointments() {
    return apiClient.get("personappointment");
  },
  getPersonAppointment(id) {
    return apiClient.get("personappointment/" + id);
  },
  getPersonAppointmentForPerson(personId) {
    return apiClient.get("personappointment/person/" + personId);
  },
  findPersonAppointmentByPersonAndAppointment(personId, appointmentId) {
    return apiClient.get(
      "personappointment/person/" + personId + "/appointment/" + appointmentId
    );
  },
  findStudentDataForTable(appointmentId) {
    return apiClient.get("/personappointment/appointment/" + appointmentId);
  },
  findTutorDataForTable(appointmentId) {
    return apiClient.get(
      "/personappointment/appointmentTutor/" + appointmentId
    );
  },
  addPersonAppointment(personappointment) {
    return apiClient.post("personappointment", personappointment);
  },
  updatePersonAppointment(personappointmentId, personappointment) {
    return apiClient.put(
      "personappointment/" + personappointmentId,
      personappointment
    );
  },
  deletePersonAppointment(personappointmentId) {
    return apiClient.delete("personappointment/" + personappointmentId);
  },
};

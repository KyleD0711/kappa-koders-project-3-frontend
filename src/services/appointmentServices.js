import apiClient from "@/services/services.js";

export default {
  getAllAppointments() {
    return apiClient.get("appointment");
  },
  getAllForGroup(id) {
    // used to get all appointments for reporting
    return apiClient.get("appointment/group/" + id);
  },
  getAppointmentInfo(id) {
    // used to get all appointments for reporting
    return apiClient.get("appointment/info/" + id);
  },
  getAppointmentHourCount(id, currWeek) {
    return apiClient.get("appointment/group/" + id + "/hours/week/" + currWeek);
  },
  getAppointment(id) {
    return apiClient.get("appointment/" + id);
  },
  getUpcomingForPerson(personId) {
    return apiClient.get("appointment/upcoming/person/" + personId);
  },
  getTutorForAppointment(id) {
    return apiClient.get("appointment/tutorAppointment/" + id);
  },
  getAppointmentForPerson(personId) {
    return apiClient.get("appointment/person/" + personId);
  },
  getAppointmentForGroup(groupId) {
    return apiClient.get("appointment/group/" + groupId);
  },
  findAppointmentsForGroup(groupId) {
    // function used to find appointments to put into the calendar
    return apiClient.get("appointment/allGroup/" + groupId);
  },
  getUpcomingAppointmentForGroup(groupId) {
    return apiClient.get("appointment/upGroup/" + groupId);
  },
  getAppointmentForPersonForGroup(groupId, personId) {
    return apiClient.get(
      "appointment/group/" + groupId + "/person/" + personId
    );
  },
  getUpcomingAppointmentsForTutor(groupId, personId) {
    return apiClient.get(
      "appointment/upcoming/tutor/" + groupId + "/person/" + personId
    );
  },
  getUpcomingAppointmentsForStudent(groupId, personId) {
    return apiClient.get(
      "appointment/upcoming/student/" + groupId + "/person/" + personId
    );
  },
  getPassedAppointmentsForTutor(groupId, personId) {
    return apiClient.get(
      "appointment/passed/tutor/" + groupId + "/person/" + personId
    );
  },
  getPassedAppointmentsForStudent(groupId, personId) {
    return apiClient.get(
      "appointment/passed/student/" + groupId + "/person/" + personId
    );
  },
  getAppointmentForFeedback(appointmentId) {
    return apiClient.get("appointment/feedback/" + appointmentId);
  },
  addAppointment(appointment) {
    return apiClient.post("appointment", appointment);
  },
  cancelAppointment(appointmentId, appointment) {
    return apiClient.post("appointment/cancel/" + appointmentId, appointment);
  },
  updateAppointment(appointmentId, appointment) {
    return apiClient.put("appointment/" + appointmentId, appointment);
  },
  deleteAppointment(appointmentId) {
    return apiClient.delete("appointment/" + appointmentId);
  },
};

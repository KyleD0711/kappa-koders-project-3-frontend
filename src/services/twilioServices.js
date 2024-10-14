import apiClient from "@/services/services.js";

export default {
  sendApplicationMessage(textInfo) {
    return apiClient.post(`twilio/sendApplication`, textInfo);
  },
  sendRequestMessage(textInfo) {
    return apiClient.post(`twilio/sendRequest`, textInfo);
  },

  sendPendingMessage(textInfo) {
    return apiClient.post(`twilio/sendPending`, textInfo);
  },
  sendConfirmedMessage(textInfo) {
    return apiClient.post(`twilio/sendConfirmed`, textInfo);
  },
  sendMessageFromAdmin(textInfo) {
    return apiClient.post(`twilio/sendMessageFromAdmin`, textInfo);
  },
  sendGroupMessage(textInfo) {
    return apiClient.post(`twilio/sendGroup`, textInfo);
  },
  sendEditedMessage(textInfo) {
    return apiClient.post(`twilio/sendEdited`, textInfo);
  },
  sendCanceledMessage(textInfo) {
    return apiClient.post(`twilio/sendCanceled`, textInfo);
  },
};

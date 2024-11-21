import { defineStore } from "pinia";

export const useChatHistoryStore = defineStore('chatHistory', {
    state: () => ({
      history: {}
    }),

    actions: {
      addToHistory(message, role, resumeId) {
        if(!this.history[resumeId]){
            this.history[resumeId] = []
        }

        this.history[resumeId].push({
            role,
            message,
        })
      },
      getHistoryForResume (resumeId){
        return history[resumeId]
      }
     }
  });
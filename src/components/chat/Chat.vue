<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";

import { useChatHistoryStore } from "../../store/chatHistory.store";
import { useResumeViewerStore } from "../../store/resumeViewer.store.js";
import { storeToRefs } from "pinia";

const chatHistory = useChatHistoryStore();
const resumeViewer = useResumeViewerStore();
const { history } = storeToRefs(chatHistory);
const { innerHTML } = storeToRefs(resumeViewer);

import sendMessage from "../../services/cohereAIServices.js";

import ResponseBubble from "./ResponseBubble.vue";

const props = defineProps({
  resumeId: {
    type: Number,
    required: true,
  },
});

const userMessage = ref({});
const isLoadingMessage = ref(false);

const handleMessageResponse = async (responseStream) => {
  chatHistory.addToHistory("", "Chatbot", props.resumeId);
  const responseIndex = history.value[props.resumeId].length - 1;

  isLoadingMessage.value = true;

  for await (const token of responseStream) {
    if (token.eventType === "text-generation") {
      history.value[props.resumeId][responseIndex].message += token.text;
    }
  }

  isLoadingMessage.value = false;
};

const handleSendMessage = async () => {
  const message = userMessage.value.message;

  const currentChatHistory = history.value[props.resumeId];

  const responseStream = await sendMessage(message, currentChatHistory || []);

  chatHistory.addToHistory(message, "User", props.resumeId);

  handleMessageResponse(responseStream);

  userMessage.value = {};

  await nextTick();

  scrollToBottom();
};

const combinedChatHistory = computed(() => {
  const currentHistory = history.value[props.resumeId] || [];

  const result = [];
  let tempObj = {};

  for (const item of currentHistory) {
    if (item.role === "User") {
      // Start a new object for the user message
      tempObj = { userMessage: item.message };
    } else if (item.role === "Chatbot" && tempObj) {
      // Add the bot response to the same object
      tempObj.botResponse = item.message;
      result.push(tempObj); // Push the complete object to the result array
      tempObj = {}; // Reset for the next pair
    }
  }

  return result;
});

const scrollPane = ref();

const scrollToBottom = () => {
  scrollPane.value.scrollTop = scrollPane.value.scrollHeight;
};

const updateChatHistoryResume = () => {
  if (!history.value[props.resumeId]) {
    history.value[props.resumeId] = [];
  }

  if (!history.value[props.resumeId][0]) {
    history.value[props.resumeId].push({
      message: "",
      role: "User",
    });
  }

  if (history.value[props.resumeId].length > 1) {
    history.value[props.resumeId].push({
      role: "User",
      message:
        `I've updated my resume, use this version for any future questions:` +
        innerHTML.value,
    });
  } else {
    history.value[props.resumeId][0].message =
      `This is the resume that this chat is regarding, ignore the HTML tags and only provide feedback on the text of the resume for this version and all future versions:` +
      innerHTML.value;
  }
};

const clearHistory = () => {
  history.value[props.resumeId] = [];
  updateChatHistoryResume();
};

const recommendationClass = computed(() => {
  if (
    history.value[props.resumeId] &&
    history.value[props.resumeId].length > 1
  ) {
    return "no-flex-grow";
  } else {
    return "w-100 d-flex flex-column align-end";
  }
});

const sendRecommendedMessage = (index) => {
  let message = "";
  switch (index) {
    case 2:
      message = "Are there any misspellings on my Resume?";
      break;
    case 3:
      message =
        "Is my resume tailored to the industry I'm applying for? If not what recommendations do you have?";
      break;
    default:
      message =
        "Can you give me some feedback on my resume? What are some areas that can be improved?";
  }

  userMessage.value.message = message;
  handleSendMessage();
};

watch(innerHTML.value, () => {
  updateChatHistoryResume();
});

onMounted(() => {
  updateChatHistoryResume();
});
</script>

<template>
  <v-card class="chat-container" color="section0">
    <v-row
      no-gutters
      class="align-center ma-4 justify-space-between no-flex-grow"
    >
      <v-row no-gutters class="align-center">
        <p class="text-h5">Ask AI</p>
        <v-icon class="ml-3"> mdi-shimmer </v-icon>
      </v-row>
      <v-btn append-icon="mdi-delete" color="lightBlue" @click="clearHistory()">
        Clear
      </v-btn>
    </v-row>
    <div ref="scrollPane" class="scroll-pane">
      <v-col
        v-for="(currentChatHistory, index) in combinedChatHistory"
        :key="index"
        class="w-100 d-flex flex-column pa-0 px-4"
      >
        <div class="d-flex justify-end">
          <!-- User message on the right -->
          <v-card color="chatUser" class="chat-bubble user-message w-75 text-start">
            {{ currentChatHistory.userMessage }}
          </v-card>
        </div>
        <ResponseBubble color="chatAI" :text="currentChatHistory.botResponse" />
      </v-col>
    </div>

    <v-col :class="recommendationClass">
      <v-chip
        class="my-2 mr-1 px-4"
        prepend-icon="mdi-file-search-outline"
        variant="flat"
        color="lightBlue"
        @click="sendRecommendedMessage(1)"
      >
        General Feedback
      </v-chip>
      <v-chip
        class="my-2 mr-1 px-4"
        prepend-icon="mdi-file-edit"
        variant="flat"
        color="lightBlue"
        @click="sendRecommendedMessage(2)"
      >
        Spell Check
      </v-chip>
      <v-chip
        class="my-2 mr-1 px-4"
        prepend-icon="mdi-content-cut"
        variant="flat"
        color="lightBlue"
        @click="sendRecommendedMessage(3)"
      >
        Job Tailoring
      </v-chip>
    </v-col>

    <Vueform
      size="md"
      :endpoint="false"
      @submit="handleSendMessage()"
      :display-errors="false"
      v-model="userMessage"
      class="mx-4 mb-4"
      sync
    >
      <GroupElement name="message-send-row">
        <TextElement
          name="message"
          :columns="{
            container: 10,
            label: 12,
            wrapper: 12,
          }"
        />
        <ButtonElement
          color="lightBlue"
          :submits="true"
          button-label="Send"
          :disabled="isLoadingMessage"
          :columns="{
            container: 2,
            label: 12,
            wrapper: 12,
          }"
        />
      </GroupElement>
    </Vueform>
  </v-card>
</template>

<style scoped>
.chat-bubble {
  padding: 10px;
  border-radius: 10px;
  background-color: var(--v-theme-lightBlue); /* Light blue */
  color: var(--var-theme-text);
  margin-bottom: 16px;
  margin-top: 16px;
}

.suggestion-chip {
  width: fit-content;
}

.no-flex-grow {
  flex-shrink: 0; /* Prevent the row from shrinking */
  flex-grow: 0; /* Prevent the row from growing */
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scroll-pane {
  width: 100%; /* Adjust width as needed */
  height: 48vh; /* Sets the height limit for scroll */
  overflow-y: auto; /* Enables vertical scrolling */
  overflow-x: hidden; /* Hides horizontal scrolling */
  box-sizing: border-box; /* Ensures padding is within total width/height */
  margin-bottom: 12px;
  flex-grow: 1;
}

/* Custom scrollbar styling (works in webkit browsers like Chrome and Safari) */
.scroll-pane::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
  padding-left: 4px;
}

.scroll-pane::-webkit-scrollbar-thumb {
  border-radius: 4px; /* Rounded edges */
}

.scroll-pane::-webkit-scrollbar-thumb:hover {
}
</style>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue"

import { useChatHistoryStore } from "../../store/chatHistory.store";
import { useResumeViewerStore } from "../../store/resumeViewer.store.js";
import { storeToRefs } from "pinia";

const chatHistory = useChatHistoryStore();
const resumeViewer = useResumeViewerStore();
const { history } = storeToRefs(chatHistory);
const { innerHTML } = storeToRefs(resumeViewer)

import sendMessage from "../../services/cohereAIServices.js"

import ResponseBubble from "./ResponseBubble.vue";

const props = defineProps({
    resumeId: {
        type: Number,
        required: true
    }
})

const handleMessageResponse = async (responseStream) => {
    chatHistory.addToHistory('', 'Chatbot', props.resumeId)
    const responseIndex = history.value[props.resumeId].length - 1

    for await (const token of responseStream) {
        if (token.eventType === "text-generation") {
            history.value[props.resumeId][responseIndex].message += token.text
        }
    }

}

const handleSendMessage = async () => {
    const message = userMessage.value.message;

    const currentChatHistory = chatHistory.getHistoryForResume(1)
    console.log(currentChatHistory)

    const responseStream = await sendMessage(message, currentChatHistory || [])

    chatHistory.addToHistory(message, 'User', props.resumeId)

    handleMessageResponse(responseStream)

    userMessage.value = {}

    await nextTick()

    scrollToBottom()
}
const userMessage = ref({})

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

const scrollPane = ref()

const scrollToBottom = () => {
    scrollPane.value.scrollTop = scrollPane.value.scrollHeight;
}

const initializeChatHitory = () => {
    if(!history.value[props.resumeId]){
        history.value[props.resumeId] = []
    }

    if(!history.value[props.resumeId][0]){
        history.value[props.resumeId].push({
            message: "",
            role: "User"
        })
    }
    history.value[props.resumeId][0].message = `This is the resume that this chat is regarding:` + innerHTML.value
}

watch(innerHTML.value, () => {
    initializeChatHitory();
})

onMounted(() => {
    initializeChatHitory();
})
</script>

<template>
    <div>
        <v-row no-gutters class="align-center ma-4">
            <p class="text-h5">Ask AI</p>
            <v-icon class="ml-3">
                mdi-shimmer
            </v-icon>
        </v-row>
        <div ref="scrollPane" class="scroll-pane">
            <v-col
                v-for="(currentChatHistory, index) in combinedChatHistory"
                :key="index"
                class="w-100 d-flex flex-column pa-0 px-4"
            >
                <div class="d-flex justify-end">
                    <!-- User message on the right -->
                    <v-card class="chat-bubble user-message w-75 text-start">
                            {{ currentChatHistory.userMessage }}
                    </v-card>
                </div>
                <ResponseBubble :text="currentChatHistory.botResponse"/>
                
            </v-col>
        </div>


        <Vueform
            size="md"
            :endpoint="false"
            @submit="handleSendMessage()"
            :display-errors="false"
            v-model="userMessage"
            class="mx-4"
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
                    name="Submit"
                    :submits="true"
                    button-label="Send"
                    :columns="{
                        container: 2,
                        label: 12,
                        wrapper: 12,
                    }"
                />
            </GroupElement>
        </Vueform>
    </div>    
</template>

<style scoped>
.chat-bubble {
    padding: 10px;
    border-radius: 10px;
    background-color: #E1E1E1; /* Light blue */
    margin-bottom: 16px;
    margin-top: 16px;
}

.scroll-pane {
  width: 100%;          /* Adjust width as needed */
  height: 72vh;    /* Sets the height limit for scroll */
  overflow-y: auto;     /* Enables vertical scrolling */
  overflow-x: hidden;   /* Hides horizontal scrolling */
  box-sizing: border-box; /* Ensures padding is within total width/height */
  margin-bottom: 12px;
}

/* Custom scrollbar styling (works in webkit browsers like Chrome and Safari) */
.scroll-pane::-webkit-scrollbar {
  width: 8px;           /* Width of the scrollbar */
  padding-left: 4px;
}

.scroll-pane::-webkit-scrollbar-thumb {
  background-color: #888; /* Scrollbar thumb color */
  border-radius: 4px;    /* Rounded edges */
}

.scroll-pane::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Darker color on hover */
}
</style>
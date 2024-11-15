<script setup>
import { nextTick, ref, watch } from "vue"
import sendMessage from "../../services/cohereAIServices.js"

import ResponseBubble from "./ResponseBubble.vue";

const handleMessageResponse = async (responseStream) => {
    responseHistory.value.push("")
    const responseIndex = responseHistory.value.length - 1

    for await (const token of responseStream) {
        if (token.eventType === "text-generation") {
            responseHistory.value[responseIndex] += token.text
        }
    }
}

const handleSendMessage = async () => {
    const message = userMessage.value.message;

    const responseStream = await sendMessage(message)
    handleMessageResponse(responseStream)

    messageHistory.value.push(message);
    userMessage.value = {}

    await nextTick()

    scrollToBottom()
}
const userMessage = ref({})

const messageHistory = ref([])
const responseHistory = ref([])

const responseText = ref("")

const scrollPane = ref()

const scrollToBottom = () => {
    scrollPane.value.scrollTop = scrollPane.value.scrollHeight;
}
</script>

<template>
    <v-col cols="4">
        <div>
            <div ref="scrollPane" class="scroll-pane">
                <v-col
                    v-for="(message, index) in messageHistory"
                    :key="index"
                    class="w-100 d-flex flex-column pa-0"
                >
                    <div class="d-flex justify-end">
                        <!-- User message on the right -->
                        <v-card class="chat-bubble user-message w-75 text-start">
                                {{ message }}
                        </v-card>
                    </div>
                    <ResponseBubble :text="responseHistory[messageHistory.indexOf(message)]"/>
                    
                </v-col>
            </div>
    
    
            <Vueform
                size="md"
                :endpoint="false"
                @submit="handleSendMessage()"
                :display-errors="false"
                v-model="userMessage"
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
    </v-col>
    
</template>

<style scoped>
.chat-bubble {
    padding: 10px;
    border-radius: 10px;
    margin: 5px 0;
    background-color: #E1E1E1; /* Light blue */
    margin-bottom: 28px;
}

.scroll-pane {
  width: 100%;          /* Adjust width as needed */
  height: 80vh;    /* Sets the height limit for scroll */
  overflow-y: auto;     /* Enables vertical scrolling */
  overflow-x: hidden;   /* Hides horizontal scrolling */
  box-sizing: border-box; /* Ensures padding is within total width/height */
  margin-bottom: 12px;
}

/* Custom scrollbar styling (works in webkit browsers like Chrome and Safari) */
.scroll-pane::-webkit-scrollbar {
  width: 8px;           /* Width of the scrollbar */
}

.scroll-pane::-webkit-scrollbar-thumb {
  background-color: #888; /* Scrollbar thumb color */
  border-radius: 4px;    /* Rounded edges */
}

.scroll-pane::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Darker color on hover */
}
</style>
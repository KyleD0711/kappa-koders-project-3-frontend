<script setup>
import { ref } from "vue"
import sendMessage from "../../services/cohereAIServices.js"

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

</script>

<template>
    <div class="d-flex justify-start">
        <!-- AI response on the left -->
        <v-card class="chat-bubble ai-response text-start">
            <div v-if="props.text != ''">
                {{ props.text }}
            </div>
            <v-col v-else class="typing-indicator w-100 d-flex justify-center">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </v-col>
        </v-card>


    </div>
</template>

<style scoped>
.chat-bubble {
    max-width: 75%;
    width: fit-content;
    padding: 10px;
    border-radius: 10px;
    margin: 5px 0;
    background-color: #262626  ;
    color: #ffffff;
}

.typing-indicator {
    padding: 5px 10px;
    display: flex;
    gap: 5px;
}

.dot {
    width: 8px;
    height: 8px;
    background-color: #9e9e9e; /* Gray color */
    border-radius: 50%;
    animation: bounce 0.6s infinite alternate;
}

.dot:nth-child(1) {
    animation-delay: 0s;
}
.dot:nth-child(2) {
    animation-delay: 0.2s;
}
.dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes bounce {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(-8px); /* Controls bounce height */
    }
}
</style>
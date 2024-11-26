<script setup>
import { ref, onMounted } from "vue";
import reviewServices from "../../services/reviewServices";
import TextBubble from "./TextBubble.vue";

const props = defineProps({
  resumeId: {
    type: String,
    required: true,
  },
});

const errorMessage = ref("");
const isData = ref(false);
const reviews = ref([]);
const currentIndex = ref(0);
const currentReview = ref({});

const nextReview = () => {
  if (currentIndex.value < reviews.value.length - 1) {
    currentIndex.value++;
    currentReview.value = reviews.value[currentIndex.value];
  }
};
const prevReview = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    currentReview.value = reviews.value[currentIndex.value];
  }
};

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

onMounted(async () => {
  await reviewServices
    .getReviewsForResume(props.resumeId)
    .then((response) => {
      reviews.value = response.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      console.log(reviews.value);
      if (reviews.value.length > 0) {
        isData.value = true;
        currentReview.value = reviews.value[currentIndex.value];
      }
    })
    .catch((error) => {
      errorMessage.value = error.message;
    });
});
</script>
<template>
  <div class="center-text" v-if="!isData">
    <div v-if="!errorMessage">No reviews found!</div>
    <div v-else class="error">
      {{
        errorMessage != ""
          ? errorMessage
          : "An error has occurred while trying to fetch your reviews!"
      }}
    </div>
  </div>
  <div v-else>
    <div class="review-navigation">
      <!-- Left button for previous review -->
      <v-btn
        icon
        @click="prevReview"
        :disabled="currentIndex === 0"
        class="chevron-button"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <!-- Review content section -->
      <div class="tab-content">
        <div class="main-text">
          {{
            currentReview.completedBy
              ? "Completed By: " + currentReview.completedBy
              : "Current Status: " + currentReview.status
          }}
        </div>
        <div class="sub-text">
          {{
            currentReview.completedBy
              ? "Completed at: " +
                formatter.format(new Date(currentReview.updatedAt))
              : "Last updated:" +
                formatter.format(new Date(currentReview.updatedAt))
          }}
        </div>
      </div>

      <!-- Right button for next review -->
      <v-btn
        icon
        @click="nextReview"
        :disabled="currentIndex === reviews.length - 1"
        class="chevron-button"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <TextBubble
      :sectionName="'Overview'"
      :reviewText="currentReview.summary"
    ></TextBubble>
    <hr class="light-breakline" />
    <TextBubble
      v-for="comment in currentReview.comment"
      :sectionName="
        (
          comment.resumeSection.section_type[0].toUpperCase() +
          comment.resumeSection.section_type.slice(1)
        ).replace('_', ' ')
      "
      :reviewText="comment.text"
    ></TextBubble>
  </div>
</template>
<style scoped>
.center-text {
  display: flex; /* Use Flexbox */
  justify-content: center; /* Horizontally center text */
  align-items: center; /* Vertically center text */
  height: 100%; /* Fill the parent container */
  width: 100%; /* Fill the parent container */
  text-align: center; /* Optional, ensures text is aligned if multi-line */
}

.error {
  color: red;
}

.light-breakline {
  border: none;
  border-top: 3px solid #737373;
  margin: 10px 0;
  padding-bottom: 3%;
}

.main-text {
  font-size: 1.2rem; /* Scale text size based on the parent */
  font-weight: bold;
  word-wrap: break-word; /* Prevent text overflow */
}

.sub-text {
  font-size: 0.9rem; /* Slightly smaller font for sub-text */
  color: rgba(215, 213, 213, 0.6); /* Lighter text for sub-text */
  margin-top: 4px; /* Space between main and sub-text */
}

.review-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chevron-button {
  background-color: transparent; /* Remove the background */
  box-shadow: none !important; /* Remove any box shadow */
  border: none !important; /* Remove the border */
  padding: 0 !important; /* Remove extra padding */
  min-width: 36px; /* Ensure the button is still clickable */
}

.chevron-button .v-icon {
  font-size: 24px; /* Adjust the size of the chevron */
  color: #ccc; /* Set the color of the icon (black or any color you prefer) */
}

.chevron-button:disabled .v-icon {
  color: #000; /* Light gray for disabled state */
}
</style>

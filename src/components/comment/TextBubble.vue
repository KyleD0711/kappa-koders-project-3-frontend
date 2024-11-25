<script setup>
const props = defineProps({
  sectionName: {
    type: String,
    required: true, // The name of the section
  },
  reviewText: {
    type: String,
    required: true, // The review text associated with the section
  },
});
</script>
<template>
  <div class="review-bubble">
    <div class="section-name">
      {{ sectionName }}
    </div>
    <div class="review-text">
      {{ reviewText }}
    </div>
  </div>
</template>
<style scoped>
.review-bubble {
  background-color: #f5f5f5; /* Light gray background */
  border-radius: 12px; /* Rounded corners for the bubble */
  padding: 16px; /* Padding inside the bubble */
  margin: 20px 10px;
  max-width: 600px; /* Limit the bubble's width */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  font-family: Arial, sans-serif;
}

.section-name {
  font-size: 16px; /* Smaller text for the section name */
  font-weight: bold; /* Make it stand out */
  color: #333; /* Darker color for contrast */
  margin-bottom: 8px; /* Space between section name and review text */
}

.review-text {
  font-size: 16px; /* Larger text for the review */
  color: #555; /* Softer dark color for readability */
  line-height: 1.5; /* Improve readability with line spacing */
}
</style>

<script setup>
import { ref } from "vue";
import reviewServices from "../../services/reviewServices";
import { onMounted } from "vue";

const props = defineProps({
  resumeId: {
    type: Number,
    required: true,
  },
});

const err = ref(false);

const getReviews = async () => {
  await reviewServices
    .getReviewsForResume(props.resumeId)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(async () => {
  await getReviews();
});
</script>
<template>
  <div class="center-text">
    <div v-if="!err">No reviews found!</div>
    <div v-else class="error">
      An error has occurred while trying to fetch your reviews!
    </div>
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
</style>

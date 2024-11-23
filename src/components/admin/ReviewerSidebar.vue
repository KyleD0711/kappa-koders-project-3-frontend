<script setup>
import { ref } from "vue";
import router from "../../router";
import Utils from "../../config/utils";
import commentServices from "../../services/commentServices";
import reviewServices from "../../services/reviewServices";
import { useReviewerSidebarStore } from "../../store/reviewerSidebar.store";
import { storeToRefs } from "pinia";

const props = defineProps({
  reviewId: {
    type: Number,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
  },
});

const reviewerSidebarStore = useReviewerSidebarStore();
const { sectionData, overviewData } = storeToRefs(reviewerSidebarStore);

const isError = ref(false);

const submitReview = async (isSave) => {
  console.log(isSave);
  let submitData = [];
  if (overviewData.value == "" || overviewData == undefined) {
    isError.value = true;
    return;
  }

  for (let i = 0; i < props.sections.length; i++) {
    submitData = [
      ...submitData,
      {
        sectionId: props.sections[i].section_id,
        text: sectionData.value[i].text,
        commentId: sectionData.value[i].id,
      },
    ];
  }

  const user = Utils.getStore("user");
  const review = {
    summary: overviewData.value,
    reviewer: `${user.fName} ${user.lName}`,
    status: isSave ? "in-review" : "completed",
  };

  // Send review to backend
  await reviewServices.updateReview(props.reviewId, review);

  await submitData.forEach(async (value) => {
    if (value.text !== undefined && value.text !== "") {
      const comment = {
        reviewId: props.reviewId,
        text: value.text,
        resumeSectionSectionId: value.sectionId,
      };

      // If a comment already exists
      if (value.commentId !== undefined) {
        commentServices.updateComment(value.commentId, comment);
      } else {
        // Create comment in the backend
        commentServices.createComment(props.reviewId, comment);
      }
    }
  });

  if (!isSave) {
    router.push({ name: "reviewResumes" });
  }
};
</script>

<template>
  <div class="resume_title">Resume Title</div>
  <div class="d-flex flex-column fill-height pa-0">
    <v-expansion-panels>
      <v-expansion-panel class="section-0">
        <v-expansion-panel-title class="section_title"
          >Overview</v-expansion-panel-title
        >
        <v-expansion-panel-text>
          <v-textarea
            v-model="overviewData"
            auto-grow
            variant="solo-filled"
          ></v-textarea>
          <span v-if="isError" style="color: red">Overview is required!</span>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="light-breakline"></div>

    <v-card class="mb-3" v-for="(section, i) in sections" :key="i">
      <v-expansion-panels>
        <v-expansion-panel class="section-0">
          <v-expansion-panel-title class="section_title">{{
            section.section_title[0].toUpperCase() +
            section.section_title.slice(1)
          }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-textarea
              v-model="sectionData[i].text"
              auto-grow
              variant="solo-filled"
            ></v-textarea>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <div class="d-flex flex-wrap align-center justify-center" style="gap: 16px">
      <v-btn @click="submitReview(false)" color="#3D7AE2" large>
        Submit Review
      </v-btn>
      <v-btn @click="submitReview(true)" color="#3D7AE2" large>
        Save Changes
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.resume_title {
  color: white;
  padding-left: 2%;
  padding-bottom: 2%;
  font-size: 30px;
  cursor: pointer;
}

.section_title {
  font-size: 20px;
}

.bottom_button {
  width: 30%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 5px;
}

.section-0 {
  background-color: #403f3f;
  color: white;
}

.light-breakline {
  border: none;
  border-top: 3px solid #737373;
  margin: 10px 0;
  padding-bottom: 3%;
}
</style>

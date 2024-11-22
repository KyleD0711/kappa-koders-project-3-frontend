<script setup>
import { ref, onMounted } from "vue";
import router from "../../router";
import Utils from "../../config/utils";
import resumeServices from "../../services/resumeServices";
import commentServices from "../../services/commentServices";

// const props = defineProps({
//   reviewId: {
//     type: Number,
//     required: true,
//   },
// });

const reviewId = ref(2);

const sections = ref([
  {
    section_title: "education",
    section_id: 1,
  },
  {
    section_title: "education",
    section_id: 2,
  },
  {
    section_title: "experience",
    section_id: 1,
  },
  {
    section_title: "award",
    section_id: 3,
  },
]);
const sectionData = ref([]);
const overviewData = ref("");
const isError = ref(false);

const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  // Replace special characters with their HTML-encoded equivalents
  const sanitized = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;");

  return sanitized;
};

const submitReview = async () => {
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
        text: sectionData.value[i],
      },
    ];
  }

  const user = Utils.getStore("user");
  console.log(sanitizeInput(overviewData.value));
  const review = {
    summary: overviewData.value,
    reviewer: `${user.fName} ${user.lName}`,
    status: "completed",
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

      // Create comment in the backend
      commentServices
        .createComment(props.reviewId, comment)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  router.push({ name: "reviewResumes" });
};
</script>

<template>
  <div class="resume_title">Resume Title</div>
  <v-form
    @submit.prevent="submitReview"
    class="d-flex flex-column fill-height pa-0"
  >
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
              v-model="sectionData[i]"
              auto-grow
              variant="solo-filled"
            ></v-textarea>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-btn type="submit" block color="#3D7AE2" large> Submit </v-btn>
  </v-form>
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

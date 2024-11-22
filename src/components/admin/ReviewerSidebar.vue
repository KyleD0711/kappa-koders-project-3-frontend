<script setup>
import { ref } from "vue";
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
  for (let i = 0; i < sections.value.length; i++) {
    submitData = [
      ...submitData,
      {
        sectionId: sections.value[i].section_id,
        text: sectionData.value[i],
      },
    ];
  }

  const user = Utils.getStore("user");
  const review = {
    overview: sanitizeInput(overviewData.value),
    reviewer: `${user.fName} ${user.lName}`,
    status: "completed",
  };

  // Send review to backend
  await resumeServices
    .updateReview(reviewId.value, review)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });

  await submitData.forEach(async (value) => {
    if (value !== undefined || value !== "") {
      const comment = {
        reviewId: reviewId.value,
        text: sanitizeInput(value.text),
        resumeSectionId: value.sectionId,
      };

      // Create comment in the backend
      commentServices
        .createComment(reviewId.value, comment)
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

onMounted(async () => {
  reviewServices
    .getReview(props.reviewId)
    .then((data) => {
      const review = { ...data.data };
      getResumeService.getResume(review.resumeId).then((value) => {
        console.log(value);
        metadata.value = value.resumeData.metadata;
        sections.value = value.itemData;
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
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
            variant="solo-filled"
            auto-grow
            name="overview"
          ></v-textarea>
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

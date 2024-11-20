<script setup>
import { ref } from "vue";
import router from "../../router";
import Utils from "../../config/utils";

const props = defineProps({
  reviewId: {
    type: Number,
    required: true,
  },
});

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
    section_id: 3,
  },
  {
    section_title: "award",
    section_id: 5,
  },
]);
const sectionData = ref([]);
const overviewData = ref("");

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
    overview: overviewData.value,
    reviewer: `${user.fName} ${user.lName}`,
    status: "completed",
  };

  // Send review to backend

  await submitData.forEach(async (value) => {
    if (value !== undefined || value !== "") {
      const comment = {
        reviewId: props.reviewId,
        text: value.text,
        resumeSectionId: value.sectionId,
      };

      // Create comment in the backend
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
            variant="solo-filled"
            auto-grow
            name="overview"
          ></v-textarea>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <br class="light-breakline" />

    <v-card class="mb-3">
      <v-expansion-panels v-for="(section, i) in sections" :key="i">
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
      <v-btn type="submit" block color="#3D7AE2" large> Submit </v-btn>
    </v-card>
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

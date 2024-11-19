<script setup>
import { ref } from "vue";

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

const submitReview = (data) => {
  let submitData = [
    {
      section: "overview",
      data: overviewData.value,
    },
  ];
  for (let i = 0; i < sections.value.length; i++) {
    submitData = [
      ...submitData,
      {
        sectionId: sections.value[i].section_id,
        text: sectionData.value[i],
      },
    ];
  }
  console.log(submitData);
};
</script>

<template>
  <v-form
    @submit.prevent="submitReview"
    class="d-flex flex-column fill-height pa-0"
  >
    <div
      style="
        color: white;
        font-size: 2em;
        text-align: left;
        padding-bottom: 2%;
        padding-left: 5px;
      "
    >
      Resume Title
    </div>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel class="expansion_panel">
        <v-expansion-panel-title>Overview</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-textarea
            v-model="overviewData"
            variant="solo-filled"
            auto-grow
            name="overview"
          ></v-textarea>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <div class="divider"></div>
      <v-expansion-panel
        v-for="(section, i) in sections"
        :key="i"
        class="expansion_panel"
      >
        <v-expansion-panel-title>{{
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

    <div class="bottom_button">
      <v-btn type="submit" block color="#3D7AE2" large> Submit </v-btn>
    </div>
  </v-form>
</template>

<style scoped>
.bottom_button {
  width: 30%;
  position: fixed;
  bottom: 0;
  left: 0;
}

.expansion_panel {
  border-radius: 0;
  background-color: #403f3f;
  color: #ffffff;
}
</style>

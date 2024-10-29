<script setup>
import EducationModal from "./EducationModal.vue";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const headers = [
  {
    title: "Institution",
    key: "institution",
  },
  {
    title: "Degree",
    key: "degree",
  },
  {
    title: "Actions",
    key: "actions",
  },
];
const items = [
  { institution: "Oklahoma Christian University", degree: "Bachelor's" },
  { institution: "Johnson County Community College", degree: "GED" },
];

const showDialog = () => {
  isVisible.value = !isVisible.value;
};
</script>
<template>
  <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: #d9d9d9">
        Education
      </p>
      <v-btn
        variant="elevated"
        color="D9D9D9"
        style="margin: 10px"
        @click="showDialog"
        >Add new</v-btn
      >
    </div>

    <v-data-table :headers="headers" :items="items">
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
  <EducationModal></EducationModal>
</template>

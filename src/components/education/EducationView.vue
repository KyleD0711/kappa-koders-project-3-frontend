<script setup>
import { onMounted, ref } from "vue";
import EducationModal from "./EducationModal.vue";
import educationServices from "../../services/educationServices";
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
    title: "Credential Earned",
    key: "credential_earned",
  },
  {
    title: "Actions",
    key: "actions",
  },
];

const items = ref([]);
const education = ref({});
const isLoaded = ref(false);

const getEducation = async () => {
  await educationServices
    .getAllEducationForUser()
    .then((res) => {
      items.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

const deleteItem = async (item) => {
  await educationServices
    .deleteEducation(item.id)
    .then((_) => {
      getEducation();
    })
    .catch((err) => {
      console.log(err);
    });
};

const showAddDialog = () => {
  education.value = {
    institution: "",
    credential_earned: "",
    date_to: "",
    date_from: "",
    gpa: "",
    coursework: null,
  };
  isVisible.value = !isVisible.value;
};

const editItem = (item) => {
  education.value = item;
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  getEducation();
});
</script>
<template>
  <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: var(--v-theme-text)">
        Education
      </p>
      <v-btn
        variant="elevated"
        color="lightBlue"
        style="margin: 10px"
        @click="showAddDialog"
        >Add new</v-btn
      >
    </div>

    <v-data-table :headers="headers" :items="items" v-if="isLoaded" style="background-color: #C4c2c3; color: #262626"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data> No data found! </template>
    </v-data-table>
  </div>
  <EducationModal
    v-if="isVisible"
    :education="education"
    @submit-form="getEducation"
  ></EducationModal>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ExperienceModal from "./ExperienceModal.vue";
import experienceServices from "../../services/experienceServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const headers = [
  {
    title: "Employer",
    key: "employer",
  },
  {
    title: "Position Title",
    key: "position_title",
  },
  {
    title: "Actions",
    key: "actions",
  },
];

const items = ref([]);
const experience = ref({});
const isLoaded = ref(false);

const getExperience = async () => {
  await experienceServices
    .getAllExperienceForUser()
    .then((res) => {
      items.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

const deleteItem = async (item) => {
  await experienceServices
    .deleteExperience(item.id)
    .then((_) => {
      getExperience();
    })
    .catch((err) => {
      console.log(err);
    });
};

const showAddDialog = () => {
  experience.value = {
    employer: "",
    position_title: "",
    date_start: "",
    date_end: "",
  };
  isVisible.value = !isVisible.value;
};

const editItem = (item) => {
  experience.value = item;
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  getExperience();
});
</script>
<template>
  <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: #d9d9d9">
        Experience
      </p>
      <v-btn
        variant="elevated"
        style="border-color: #054a91; background-color: #054a91; color: #f2f4f3; margin: 10px;"
        @click="showAddDialog"
        >Add new</v-btn
      >
    </div>

    <v-data-table
      :headers="headers"
      :items="items"
      v-if="isLoaded"
      no-data-text="No data found!"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data> No data found! </template>
    </v-data-table>
    <ExperienceModal
      v-if="isVisible"
      :experience="experience"
      @submit-form="getExperience"
    ></ExperienceModal>
  </div>
</template>

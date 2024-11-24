<script setup>
import { onMounted, ref } from "vue";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import ProfessionalSummaryModal from "./ProfessionalSummaryModal.vue";
import professionalSummaryServices from "../../services/professionalSummaryServices";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const headers = [
  {
    title: "Professional Summary",
    key: "summary",
  },
  {
    title: "Actions",
    key: "actions",
  },
];

const items = ref([]);
const professionalSummary = ref({});
const isLoaded = ref(false);

const getProfesionalSummarys = async () => {
  await professionalSummaryServices
    .getAllProfessionalSummaryForUser()
    .then((res) => {
      items.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

const deleteProfessionalSummary = async (item) => {
  await professionalSummaryServices
    .deleteProfessionalSummary(item.id)
    .then((_) => {
      getProfesionalSummarys();
    })
    .catch((err) => {
      console.log(err);
    });
};

const showAddDialog = () => {
  professionalSummary.value = {
    summary: "",
  };
  isVisible.value = !isVisible.value;
};

const editItem = (item) => {
  console.log(item);
  professionalSummary.value = item;
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  getProfesionalSummarys();
});
</script>

<template>
  <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: #d9d9d9">
        Professional Summary
      </p>
      <v-btn
        variant="elevated"
        style="border-color: #054a91; background-color: #054a91; color: #f2f4f3; margin: 10px;"
        @click="showAddDialog"
        >Add new</v-btn
      >
    </div>

    <v-data-table :headers="headers" :items="items" v-if="isLoaded">
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteProfessionalSummary(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data> No data found! </template>
    </v-data-table>
  </div>

  <ProfessionalSummaryModal
    v-if="isVisible"
    :professional-summary="professionalSummary"
    @submit-form="getProfesionalSummarys"
  ></ProfessionalSummaryModal>
</template>

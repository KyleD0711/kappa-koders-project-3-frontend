<script setup>
import { onMounted, ref } from "vue";
import AwardModal from "./AwardModal.vue";
import educationServices from "../../services/educationServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import awardServices from "../../services/awardServices";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const headers = [
  {
    title: "Award Name",
    key: "name",
  },
  {
    title: "Awarding Institution",
    key: "institution",
  },
  {
    title: "Actions",
    key: "actions",
  },
];

const items = ref([]);
const award = ref({});
const isLoaded = ref(false);

const getAwards = async () => {
  await awardServices
    .getAllAwards()
    .then((res) => {
      items.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

const deleteItem = async (item) => {
  await awardServices
    .deleteAward(item.id)
    .then((_) => {
      getAwards();
    })
    .catch((err) => {
      console.log(err);
    });
};

const showAddDialog = () => {
  award.value = {
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
  award.value = item;
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  getAwards();
});
</script>
<template>
  <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: #d9d9d9">
        Awards
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
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data> No data found! </template>
    </v-data-table>
  </div>
  <AwardModal
    v-if="isVisible"
    :award="award"
    @submit-form="getAwards"
  ></AwardModal>
</template>

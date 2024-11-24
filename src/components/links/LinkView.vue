<script setup>
import { onMounted, ref } from "vue";
import linkServices from "../../services/linkServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import LinkModal from "./LinkModal.vue";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const headers = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "URL",
    key: "url",
  },
  {
    title: "Actions",
    key: "actions",
  },
];

const items = ref([]);
const link = ref({});
const isLoaded = ref(false);

const getLinks = async () => {
  await linkServices
    .getAllLinkForUser()
    .then((res) => {
      items.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

const deleteLink = async (item) => {
  await linkServices
    .deleteLink(item.id)
    .then((_) => {
      getLinks();
    })
    .catch((err) => {
      console.log(err);
    });
};

const showAddDialog = () => {
  link.value = {
    name: "",
    url: "",
  };
  isVisible.value = !isVisible.value;
};

const editItem = (item) => {
  link.value = item;
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  getLinks();
});
</script>

<template>
  <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: #d9d9d9">
        Links
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
        <v-icon size="small" @click="deleteLink(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data> No data found! </template>
    </v-data-table>
  </div>

  <LinkModal v-if="isVisible" :link="link" @submit-form="getLinks"></LinkModal>
</template>

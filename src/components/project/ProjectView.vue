<script setup>
import { onMounted, ref } from "vue";
import ProjectModal from "./ProjectModal.vue";
import projectServices from "../../services/projectServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const headers = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Actions",
    key: "actions",
  },
];

const items = ref([]);
const project = ref({});
const isLoaded = ref(false);

const getProject = async () => {
  await projectServices
    .getAllProjectForUser()
    .then((res) => {
      items.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

const deleteItem = async (item) => {
  await projectServices
    .deleteProject(item.id)
    .then((_) => {
      getProject();
    })
    .catch((err) => {
      console.log(err);
    });
};

const showAddDialog = () => {
  project.value = {
    name: "",
    description: "",
    date_start: "",
    date_completed: "",
  };
  isVisible.value = !isVisible.value;
};

const editItem = (item) => {
  project.value = item;
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  getProject();
});
</script>
<template>
  <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: #d9d9d9">
        Project
      </p>
      <v-btn
        variant="elevated"
        color="D9D9D9"
        style="margin: 10px"
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
    <ProjectModal
      v-if="isVisible"
      :project="project"
      @submit-form="getProject"
    ></ProjectModal>
  </div>
</template>

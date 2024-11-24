<script setup>
import { onMounted, ref } from "vue";
import SkillModal from "./SkillModal.vue";
import skillServices from "../../services/skillServices";
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
const skill = ref({});
const isLoaded = ref(false);

const getSkill = async () => {
  await skillServices
    .getAllSkillForUser()
    .then((res) => {
      items.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

const deleteItem = async (item) => {
  await skillServices
    .deleteSkill(item.id)
    .then((_) => {
      getSkill();
    })
    .catch((err) => {
      console.log(err);
    });
};

const showAddDialog = () => {
  skill.value = {
    name: "",
    description: "",
    proficiency_level: "",
  };
  isVisible.value = !isVisible.value;
};

const editItem = (item) => {
  skill.value = item;
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  getSkill();
});
</script>
<template>
  <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: #d9d9d9">
        Skill
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
    <SkillModal
      v-if="isVisible"
      :skill="skill"
      @submit-form="getSkill"
    ></SkillModal>
  </div>
</template>

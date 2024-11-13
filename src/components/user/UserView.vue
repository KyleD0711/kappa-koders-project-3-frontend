<script setup>
import { onMounted, ref } from "vue";
import userServices from "../../services/userServices";
import userRoleServices from "../../services/userRoleServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import UserModal from "./UserModal.vue";
// import { userRole } from "../../../../kappakoders-project3-backend/app/models";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const headers = [
    {
      title: "First Name",
      key: "fName",
    },
    {
      title: "Last Name",
      key: "lName"
    },
    {
        title: "Email",
        key: "email",
    },
    {
        title: "Admin",
        key: "admin",
    },
    {
        title: "Actions",
        key: "actions",
    },
];

const items = ref([]);
const link = ref({});
const isLoaded = ref(false);

const getUsers = async () => {
    await userRoleServices
    .getAllRolesForUser()
    .then((res) => {
        items.value = res.data;
        isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};


const editUser = (item) => {
  link.value = item;
  isVisible.value = !isVisible.value;
};

onMounted(() => {
    getUsers();
})
</script>

<template>
    <div style="margin: 10px">
    <div style="display: flex">
      <p style="align-self: center; margin: 10px, 20px; color: #d9d9d9">
        Users
      </p>
      >
    </div>

    <v-data-table :headers="headers" :items="items" v-if="isLoaded">
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editUser(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteUser(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data> No data found! </template>
    </v-data-table>
  </div>

  <UserModal
    v-if="isVisible"
    :link="link"
    @submit-form="getLinks"
  ></UserModal>


</template>
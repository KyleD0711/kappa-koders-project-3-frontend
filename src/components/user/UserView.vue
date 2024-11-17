<script setup>
import { onMounted, ref } from "vue";
import userServices from "../../services/userServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import UserModal from "./UserModal.vue";
import Utils from "../../config/utils";

// import { userRole } from "../../../../kappakoders-project3-backend/app/models";

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);
const curUser = ref(null);

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
const user = ref({});
const isLoaded = ref(false);

const getUsers = async () => {
  curUser.value = Utils.getStore("user");

  await userServices
    .getAllUser()
    .then((res) => {
        items.value = res.data;
        items.value.forEach(user => {
          user.userRole.forEach(role => {
            if (role.role.type === "admin") {
              user.admin = true;
            } else {
              user.admin = false;
            }
          })
        })
        isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};


const editUser = (item) => {
  user.value = item;
  isVisible.value = !isVisible.value;
};

const deleteUser = async (item) => {
  await userServices
  .deleteUser(item.id)
  .then((_) => {
    getUsers();
  })
  .catch((err) => {
    console.log(err);
  });
}

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
        <v-icon class="me-2" size="small" v-if="item.id !== curUser.value.id" @click="editUser(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" v-if="item.id !== curUser.value.id" @click="deleteUser(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data> No data found! </template>
    </v-data-table>
    
    <UserModal
    v-if="isVisible"
    :user="user"
    @submit-form="getUsers"
  ></UserModal>
 
 </div>
</template>
<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted, watch, watchEffect } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter } from "vue-router";

import { useNavBarStore } from "../store/navbar.store";
import { storeToRefs } from "pinia";

const router = useRouter();

const user = ref(null);
const title = ref("Career Services");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const isAdmin = ref(false);

const navStore = useNavBarStore();
navStore.setupRouteWatcher();
const { showNavOptions } = storeToRefs(navStore);

const adminActions = [
  {
    component: "reviewResumes",
    title: "Review Resumes",
  },
  {
    component: "users",
    title: "Users",
  },
];

const resetMenu = () => {
  user.value = null;
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
    isAdmin.value = user.value.isAdmin;
  }
};

const logout = () => {
  AuthServices.logoutUser(user.value)
    .then((response) => {
      Utils.removeItem("user");
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
});
</script>

<template>
  <div>
    <v-app-bar app>
      <router-link :to="{ name: 'resume' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="showNavOptions">
        <v-btn class="mx-2" :to="{ name: 'resume' }"> Resume </v-btn>
        <v-btn class="mx-2" :to="{ name: 'information' }"> Information </v-btn>
        <v-btn v-if="isAdmin" class="mx-2" text="Admin"
          ><v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(item, index) in adminActions"
                :key="index"
                :value="index"
                @click="router.push({ name: item.component })"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list> </v-menu
          >Admin</v-btn
        >
      </div>
      <v-menu bottom min-width="200px" rounded offset-y v-if="showNavOptions">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon x-large>
            <v-avatar v-if="user" color="secondary">
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

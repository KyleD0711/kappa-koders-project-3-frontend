<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import userProfileServices from "../services/userProfileServices"; // Import userProfileServices
import { useRouter } from "vue-router";

import { useNavBarStore } from "../store/navbar.store";
import { storeToRefs } from "pinia";
import { useEditProfileModalStore } from "../store/editProfileModal.store.js"; // Import the store

import EditProfileModal from "./EditProfileModal.vue"; // Import the modal component

const router = useRouter();

const user = ref(Utils.getStore("user")); // Get user data from local storage
const userProfile = ref(null); // Store userProfile data
const title = ref("Career Services");
const initials = ref("");
const name = ref("");
const profilePhoto = ref(""); 
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

// Use the store to manage modal visibility
const editProfileModalStore = useEditProfileModalStore();

const resetMenu = async () => {
  try {
    if (user.value) {
      const response = await userProfileServices.getUserProfile(user.value.userId); // Fetch user profile data
      userProfile.value = response; // Store the user profile data

      if (userProfile.value) {
        profilePhoto.value = userProfile.value.profilePhoto || "";
        initials.value = userProfile.value.fName[0] + userProfile.value.lName[0];
        name.value = userProfile.value.fName + " " + userProfile.value.lName;
        isAdmin.value = user.value.isAdmin; 
      }
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

const logout = () => {
  AuthServices.logoutUser(user.value) // Use user from local storage
    .then((response) => {
      Utils.removeItem("user");
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const handleProfileUpdated = () => {
  resetMenu(); // Call the function to reload user profile data
};

onMounted(() => {
  logoURL.value = ocLogo;
  resetMenu();
});
</script>

<template>
  <div>
    <v-app-bar app color="#708E9A">
      <v-row class="nav-background w-100 pr-4" align="center" no-gutters>
        <router-link :to="{ name: 'resumes' }">
          <v-img
            class="mx-2"
            :src="logoURL"
            height="50"
            width="50"
            contain
          ></v-img>
        </router-link>
        <v-toolbar-title class="text-h6">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="showNavOptions">
          <v-btn class="mx-2" :to="{ name: 'resumes' }" color="#F9C633" variant="flat"> Resumes </v-btn>
          <v-btn class="mx-2" :to="{ name: 'information' }" color="#F9C633" variant="flat"> Information </v-btn>
          <v-btn v-if="isAdmin" class="mx-2" text="Admin" color="#F9C633" variant="flat"> Admin
            <v-menu activator="parent" open-on-hover>
              <v-list>
                <v-list-item
                  v-for="(item, index) in adminActions"
                  :key="index"
                  :value="index"
                  @click="router.push({ name: item.component })"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </div>
        <v-menu bottom min-width="200px" rounded offset-y v-if="showNavOptions">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon x-large>
              <v-avatar v-if="profilePhoto" color="secondary" size="50">
                <v-img :src="profilePhoto" alt="Profile Photo" contain />
              </v-avatar>
              <v-avatar v-else color="secondary" size="50">
                <span class="accent--text font-weight-bold">{{ initials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card color="light-grey">
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="secondary" class="mt-2 mb-2" size="100" style="font-size: 30px;">
                  <v-img v-if="profilePhoto" :src="profilePhoto" alt="Profile Photo" contain />
                  <span v-else class="accent--text font-weight-bold">{{ initials }}</span>
                </v-avatar>
                <h3>{{ name }}</h3>
                <p class="text-caption mt-1">{{ user.email }}</p> <!-- Use user from local storage -->
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text color="white" @click="editProfileModalStore.open">Edit Profile</v-btn>
                <br>
                <v-btn depressed rounded text @click="logout" color="white" class="mt-2"> Logout </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-row>
    </v-app-bar>

    <!-- Edit Profile Modal -->
    <EditProfileModal :isVisible="editProfileModalStore.isVisible" @close="editProfileModalStore.close" @profileUpdated="handleProfileUpdated"/>
  </div>
</template>

<style scoped>
  .nav-background {
    height: 100%;
    background-image: url("/ResumeNavBackground.png");
    background-position: right;
    background-size: 45% 100%;
  }
</style>
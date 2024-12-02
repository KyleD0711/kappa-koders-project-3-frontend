<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref, onMounted, watch, watchEffect } from "vue";
import Utils from "../config/utils";
import AuthServices from "../services/authServices";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

import 'primeicons/primeicons.css';


import { useNavBarStore } from "../store/navbar.store";
import { storeToRefs } from "pinia";

const router = useRouter();

const theme = useTheme();


const user = ref(null);
const title = ref("Career Services");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const isAdmin = ref(false);

const navStore = useNavBarStore();
navStore.setupRouteWatcher();
const { showNavOptions } = storeToRefs(navStore);
const isDarkTheme = ref(theme.global.name.value === "darkTheme");


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


// Function to toggle themes
const toggleTheme = () => {
  theme.global.name.value = isDarkTheme.value
    ? "darkTheme"
    : "lightTheme";
};

// Watch theme changes and sync state
watch(
  () => theme.global.name.value,
  (newTheme) => {
    isDarkTheme.value = newTheme === "darkTheme";
  }
);
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
        <v-toolbar-title class="text-h6">
          {{ title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="showNavOptions">
          <v-btn class="mx-2" :to="{ name: 'resumes' }" color="#F9C633" variant="flat"> Resumes </v-btn>
          <v-btn class="mx-2" :to="{ name: 'information' }" color="#F9C633" variant="flat"> Information </v-btn>
          <v-btn v-if="isAdmin" class="mx-2" text="Admin" color="#F9C633" variant="flat"
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
          <v-card color="light-grey">
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
                <v-btn depressed rounded text @click="logout" color="white"> Logout </v-btn>
                <v-btn depressed rounded text color="white">Edit Profile</v-btn>
                <div class="theme-toggle">
                <!-- Styled v-switch -->
                <v-switch
                  v-model="isDarkTheme"
                  @change="toggleTheme"
                  inset
                  class="theme-switch"
                ></v-switch>

                <!-- Background Icons -->
                <i class="pi pi-sun sun-icon"></i>
                <i class="pi pi-moon moon-icon"></i>
              </div>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-row>
    </v-app-bar>
  </div>
</template>


<style scoped>
  .nav-background {
    height: 100%;
    background-image: url("/ResumeNavBackground.png");
    background-position: right;
    background-size: 45% 100%;
  }

  .theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 200px; /* Adjust container width */
}

.theme-switch {
  flex: 1;
  position: relative;
  z-index: 1;
}

.sun-icon,
.moon-icon {
  font-size: 1.5rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
}

.sun-icon {
  left: 10px;
  color: #fbc02d; /* Sun (yellow) color */
}

.moon-icon {
  right: 10px;
  color: #90caf9; /* Moon (blue) color */
}

.theme-switch .v-switch-track {
  background-image: linear-gradient(
    to right,
    #fbc02d, /* Sun (yellow) */
    #90caf9 /* Moon (blue) */
  );
  opacity: 0.5; /* Blend background */
}
</style>
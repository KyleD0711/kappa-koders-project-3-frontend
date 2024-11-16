<script setup>
import { ref } from 'vue';
import Chat from "./Chat.vue"

const drawer = ref(true);
</script>

<template>
      <!-- <v-app-bar app>
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title>My App</v-toolbar-title>
      </v-app-bar> -->
  
      <v-navigation-drawer
        width="500"
        v-model="drawer"
        location="right"
        color="#4c4c4c"
      >

        <Chat/>
      </v-navigation-drawer>

  </template>
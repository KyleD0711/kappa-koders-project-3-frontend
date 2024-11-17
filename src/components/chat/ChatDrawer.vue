<script setup>
import { ref } from 'vue';
import Chat from "./Chat.vue"

const drawer = ref(true);
</script>

<template>
  <v-row class="justify-end" no-gutters>
    <v-col cols="1" class="px-0 mr-n9">
      <v-tabs
        v-model="activeTab"
        direction="vertical"
        hide-slider
      >
        <v-card class="mt-1" rounded="lg">
          <v-tab size="large" height="125">
            <v-icon size="large" class="ml-n2">mdi-chat</v-icon>
          </v-tab>
        </v-card>
        <v-card class="mt-1" rounded="lg">
          <v-tab size="large" height="125">
            <v-icon size="large" class="ml-n2">mdi-comment-multiple</v-icon>
          </v-tab>
        </v-card>
      </v-tabs>
    </v-col>
  </v-row>
  
      <v-navigation-drawer
        width="500"
        v-model="drawer"
        location="right"
        color="#4c4c4c"
      >

        <Chat/>
      </v-navigation-drawer>

  </template>

<style scoped>
.tab-container {
  background-color: #E1E1E1;
  width: fit-content;
  margin-right: -38px;
}



.tabs {
  padding: 0px;
}
</style>
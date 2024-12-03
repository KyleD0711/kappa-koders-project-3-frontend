<script setup>
import { ref } from 'vue';
import Chat from "./Chat.vue"

const drawer = ref(false);
</script>

<template>
    

      <v-navigation-drawer
        width="250"
        v-model="drawer"
        location="right"
        color="section0"
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
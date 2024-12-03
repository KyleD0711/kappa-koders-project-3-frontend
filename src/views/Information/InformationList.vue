<script setup>
import SideBar from "../../components/InformationSideBar.vue";
</script>

<template>
  <v-card color="background" class="main-page">
    <SideBar></SideBar>
    <v-card class="content-area" color="background">
      <router-view></router-view>
    </v-card>
  </v-card>
</template>


<style scoped>
.main-page {
  display: flex;
  height: 100%;
}
.content-area {
  flex: 1;
  padding: 20px;
}
</style>
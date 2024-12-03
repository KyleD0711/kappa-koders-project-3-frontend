<script setup>
import SideBar from "../../components/InformationSideBar.vue";
</script>

<template>
  <v-card class="main-page" color="background">
    <SideBar></SideBar>
    <v-card class="content-area">
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
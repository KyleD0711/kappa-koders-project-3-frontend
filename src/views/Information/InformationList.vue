

<script setup>

import SideBar from '../../components/InformationSideBar.vue'

</script>

<template>
  <div class="main-page">
    <SideBar></SideBar>
    <div class="content-area">
      <router-view></router-view>
    </div>
  </div>
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
<template>
  <v-app>
    <MenuBarComponent :key="$route.fullPath"></MenuBarComponent>
    <v-main>
      <router-view :key="$route.fullPath"></router-view>
      <GoogleCalendarComponent></GoogleCalendarComponent>
    </v-main>
  </v-app>
</template>

<script>
import MenuBarComponent from "@/components/MenuBarComponent.vue";
import GoogleCalendarComponent from "./components/GoogleCalendarComponent.vue";

export default {
  name: "App",
  components: {
    MenuBarComponent,
    GoogleCalendarComponent,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

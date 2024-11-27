<script setup>
import { ref, onMounted } from "vue";
import blankResume from "/BlankResumeLogin.png";
import SocialLogin from "../components/SocialLogin.vue";

const blankResumeSrc = ref("")

onMounted(() => {
  blankResumeSrc.value = blankResume
})
</script>

<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="w-75 mx-auto login-card" rounded="xl">
      <v-row class="w-100" no-gutters>
        <div class="w-50 pa-8 grey-background">
          <v-img
            :src="blankResumeSrc"
          />
        </div>
        <v-col class="d-flex flex-column justify-center">
          <p class="mx-8 mt-8 mb-2 text-h6">Career Services:</p>
          <p class="mx-8 text-h4">Resume Builder</p>
          <p class="mx-8 mt-4 text-h5 w-75">The World Awaits Your Story</p>
          <v-spacer></v-spacer>
          <p class="mt-8 mb-6 text-subtitle-1 mx-auto">Login with your OC Email to build your resume!</p>
          <SocialLogin class="mb-6 pb-16"/>
          <v-spacer></v-spacer>
        </v-col>

      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>
.grey-background {
  background-color: #403f3f;
}
.login-card {
  max-width: 850px;
}
</style>
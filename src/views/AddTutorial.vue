<script setup>
import { ref, onMounted } from "vue";
import TutorialServices from "../services/tutorialServices";
import Utils from "../config/utils.js";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const user = Utils.getStore("user");
const tutorial = ref({
  id: null,
  title: "",
  description: "",
  published: false,
});
const message = ref("Enter data and click save");

const saveTutorial = () => {
  const data = {
    title: tutorial.value.title,
    description: tutorial.value.description,
    published: true,
    userId: user.userId,
  };
  TutorialServices.create(data)
    .then((response) => {
      tutorial.value.id = response.data.id;
      console.log("add " + response.data);
      router.push({ name: "tutorials" });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const cancel = () => {
  router.push({ name: "tutorials" });
};

onMounted(() => {
  user.value = Utils.getStore("user");
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Tutorial Add</v-toolbar-title>
      </v-toolbar>

      <br />
      <h4>{{ message }}</h4>
      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          v-model="tutorial.title"
          id="title"
          :counter="50"
          label="Title"
          required
        ></v-text-field>
        <v-text-field
          v-model="tutorial.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveTutorial"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
      </v-form>
    </v-container>
  </div>
</template>

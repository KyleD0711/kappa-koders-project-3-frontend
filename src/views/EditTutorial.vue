<script setup>
import { ref, onMounted } from "vue";
import TutorialServices from "../services/tutorialServices";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const tutorial = ref({});
const message = ref("Enter data and click save");

const props = defineProps({
  id: {
    required: true,
  },
});

const retrieveTutorial = async () => {
  try {
    const response = await TutorialServices.get(props.id);
    tutorial.value = response.data;
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const updateTutorial = async () => {
  const data = {
    title: tutorial.value.title,
    description: tutorial.value.description,
  };
  try {
    const response = await TutorialServices.update(props.id, data);
    tutorial.value.id = response.data.id;
    router.push({ name: "tutorials" });
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const cancel = () => {
  router.push({ name: "tutorials" });
};

onMounted(() => {
  retrieveTutorial();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Tutorial Edit</v-toolbar-title>
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
          @click="updateTutorial()"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel()"> Cancel </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

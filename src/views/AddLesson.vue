<script setup>
import LessonServices from "../services/lessonServices";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(true);
const lesson = ref({
  id: null,
  title: "",
  description: "",
  published: false,
});
const message = ref("Enter data and click save");

const props = defineProps({
  tutorialId: {
    required: true,
  },
});

const saveLesson = () => {
  const data = {
    title: lesson.value.title,
    description: lesson.value.description,
    tutorialId: props.tutorialId,
  };
  LessonServices.createLesson(props.tutorialId, data)
    .then((response) => {
      lesson.value.id = response.data.id;

      router.push({ name: "view", params: { id: props.tutorialId } });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const cancel = () => {
  router.push({ name: "view", params: { id: props.tutorialId } });
};
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Lesson Edit</v-toolbar-title>
      </v-toolbar>
      <br />
      <h4>{{ message }}</h4>
      <br />
      <h4>Tutorial: {{ tutorialId }}</h4>
      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          v-model="lesson.title"
          id="title"
          :counter="50"
          label="Title"
          required
        ></v-text-field>
        <v-text-field
          v-model="lesson.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveLesson"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel"> Cancel </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

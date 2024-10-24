<script setup>
import LessonServices from "../services/lessonServices";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const lesson = ref({});
const message = ref("Enter data and click save");

const props = defineProps({
  tutorialId: {
    required: true,
  },
  lessonId: {
    required: true,
  },
});

const retrieveLesson = () => {
  LessonServices.getLesson(props.tutorialId, props.lessonId)
    .then((response) => {
      lesson.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const saveLesson = () => {
  var data = {
    title: lesson.value.title,
    description: lesson.value.description,
    tutorialId: lesson.value.tutorialId,
  };
  LessonServices.updateLesson(lesson.value.tutorialId, lesson.value.id, data)
    .then((response) => {
      lesson.value.id = response.data.id;

      router.push({
        name: "view",
        params: { id: lesson.value.tutorialId },
      });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const cancel = () => {
  router.push({
    name: "view",
    params: { id: lesson.value.tutorialId },
  });
};

onMounted(() => {
  retrieveLesson();
});
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
      <h4>Tutorial: {{ tutorialId }} Lesson: {{ lessonId }}</h4>
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

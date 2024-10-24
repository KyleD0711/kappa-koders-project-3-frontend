<script setup>
import TutorialServices from "../services/tutorialServices";
import LessonServices from "../services/lessonServices";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tutorial = ref({});
const lessons = ref([]);
const message = ref("Add, Edit or Delete Lessons");

const props = defineProps({
  id: {
    required: true,
  },
});

const retrieveLessons = () => {
  TutorialServices.get(props.id)
    .then((response) => {
      tutorial.value = response.data;
      LessonServices.getAllLessons(props.id)
        .then((response) => {
          lessons.value = response.data;
        })
        .catch((e) => {
          message.value = e.response.data.message;
        });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const editTutorial = () => {
  router.push({ name: "edit", params: { id: props.id } });
};

const editLesson = (lesson) => {
  router.push({
    name: "editLesson",
    params: { tutorialId: props.id, lessonId: lesson.id },
  });
};

const addLesson = () => {
  router.push({ name: "addLesson", params: { tutorialId: props.id } });
};

const deleteLesson = (lesson) => {
  LessonServices.deleteLesson(lesson.tutorialId, lesson.id)
    .then(() => {
      retrieveLessons();
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

onMounted(() => {
  retrieveLessons();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Tutorial View</v-toolbar-title>
      </v-toolbar>
      <br />
      <v-card>
        <v-card-title>
          {{ tutorial.title }}
          <v-btn class="mx-2" color="primary" @click="editTutorial">Edit</v-btn>
          <v-btn class="mx-2" color="success" @click="addLesson"
            >Add Lesson</v-btn
          >
        </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Title</th>
              <th class="text-left">Description</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lessons" :key="item.title">
              <td>{{ item.title }}</td>
              <td>{{ item.description }}</td>
              <td>
                <v-icon small class="mx-4" @click="editLesson(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small class="mx-4" @click="deleteLesson(item)">
                  mdi-trash-can
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>

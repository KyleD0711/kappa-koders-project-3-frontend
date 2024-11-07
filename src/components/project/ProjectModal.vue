<script setup>
import { ref, defineEmits, onMounted } from "vue";
import projectServices from "../../services/projectServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { Validator } from "@vueform/vueform";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const item = ref({});
const errorMsg = ref("");

const closeDialog = () => {
  isVisible.value = !isVisible.value;
};

const submitForm = async () => {
  const data = {
    id: props.project.id,
    ...item.value,
  };
  if (data.id === null || data.id === undefined || data.id === "") {
    addItem(data);
  } else {
    updateItem(data);
  }
};

const addItem = async (data) => {
  await projectServices
    .createProject(data)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const updateItem = async (item) => {
  await projectServices
    .updateProject(item)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const dateValidator = class extends Validator {
  get msg() {
    return "Date Start must be before Date Completed";
  }

  check(value) {
    const date1 = new Date(value.date_start);
    const date2 = new Date(value.date_completed);

    return date1 < date2;
  }
};

const descriptionValidator = class extends Validator {
  get msg() {
    return "Description must be under 45 characters long";
  }

  check(value) {
    return value.length <= 45;
  }
};

onMounted(() => {
  if (props.project.id != null) {
    item.value = props.project;
  }
});
</script>
<template>
  <v-dialog v-model="isVisible" max-width="60%">
    <div style="background-color: #d9d9d9; border-radius: 10px; padding: 20px">
      <Vueform
        size="md"
        :endpoint="false"
        @submit="submitForm"
        :display-errors="false"
        v-model="item"
        sync
      >
        <StaticElement
          name="project_title"
          content="Project"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement name="name" before="Name" :rules="['required']" />
        <TextElement
          name="description"
          before="Description"
          :rules="['required', descriptionValidator]"
        ></TextElement>
        <GroupElement name="date_container" :rules="[dateValidator]">
          <DateElement
            name="date_start"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
            before="Date Start"
            :rules="['required']"
          ></DateElement>
          <DateElement
            name="date_completed"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
            before="Date Completed"
            :rules="['required']"
          ></DateElement>
        </GroupElement>
        <StaticElement></StaticElement>
        <GroupElement name="button_container">
          <ButtonElement
            secondary
            name="cancel"
            :submits="false"
            button-label="Cancel"
            :full="true"
            size="md"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
            @click="closeDialog"
          />
          <ButtonElement
            name="Submit"
            :submits="true"
            button-label="Submit"
            :full="true"
            size="md"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
          />
        </GroupElement>
        <StaticElement name="errormsg" v-if="errorMsg"
          ><span style="color: red">{{ errorMsg }}</span></StaticElement
        >
      </Vueform>
    </div>
  </v-dialog>
</template>

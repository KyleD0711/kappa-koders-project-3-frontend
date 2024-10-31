<script setup>
import { ref, defineEmits } from "vue";
import educationServices from "../../services/educationServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { Validator } from "@vueform/vueform";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
  education: {
    type: Object,
    required: true,
  },
});

const item = ref({});
const degreeItems = ["Masters", "Bachelors", "Associates"];
const errorMsg = ref("");

const closeDialog = () => {
  isVisible.value = !isVisible.value;
};

const submitForm = async () => {
  const data = {
    id: props.education.id,
    ...item.value,
  };
  if (data.id === null || data.id === undefined || data.id === "") {
    addItem(data);
  } else {
    updateItem(data);
  }
};

const addItem = async (data) => {
  await educationServices
    .createEducation(data)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const updateItem = async (item) => {
  await educationServices
    .updateEducation(item)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const gpa = class extends Validator {
  get msg() {
    return "GPA must be between 0 and 4.0";
  }
  check(value) {
    return value <= 4.0 && value > 0;
  }
};

const dateValidator = class extends Validator {
  get msg() {
    return "Date From must be before Date To.";
  }
  check(value) {
    const date1 = new Date(value.date_from);
    const date2 = new Date(value.date_to);
    return date1 < date2;
  }
};

onMounted(() => {
  if (props.education.id != null) {
    item.value = props.education;
  }
});
</script>
<template>
  <v-dialog v-model="isVisible" max-width="60%">
    <v-card
      style="background-color: #d9d9d9; border-radius: 10px; padding: 20px"
    >
      <Vueform
        size="md"
        :endpoint="false"
        @submit="submitForm"
        :display-errors="false"
        v-model="item"
        sync
      >
        <StaticElement
          name="education_title"
          content="Education"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement
          name="institution"
          before="Institution"
          :rules="['required']"
        />
        <SelectElement
          name="credential_earned"
          :search="true"
          :items="degreeItems"
          :native="false"
          before="Credential Earned"
          :rules="['required']"
        ></SelectElement>
        <GroupElement name="date_container" :rules="[dateValidator]">
          <DateElement
            name="date_from"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
            before="Date From"
            :rules="['required']"
          ></DateElement>
          <DateElement
            name="date_to"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
            before="Date To"
            :rules="['required']"
          ></DateElement>
        </GroupElement>
        <TextElement
          name="gpa"
          add-class="gpa-field"
          before="GPA"
          :rules="['required', gpa]"
        ></TextElement>
        <TextareaElement
          name="coursework"
          before="Course Work"
        ></TextareaElement>
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
    </v-card>
  </v-dialog>
</template>

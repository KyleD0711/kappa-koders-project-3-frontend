<script setup>
import awardServices from "../../services/awardServices";
import { ref, defineEmits } from "vue";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { Validator } from "@vueform/vueform";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
  award: {
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
    id: props.award.id,
    ...item.value,
  };
  if (data.id === null || data.id === undefined || data.id === "") {
    addItem(data);
  } else {
    updateItem(data);
  }
};

const addItem = async (data) => {
  await awardServices
    .createAward(data)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const updateItem = async (item) => {
  await awardServices
    .updateAward(item)
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

onMounted(() => {
  if (props.award.id != null) {
    item.value = props.award;
  }
});
</script>
<template>
  <v-dialog v-model="isVisible" max-width="60%">
    <v-card
      style="background-color: #d9d9d9; border-radius: 10px; padding: 20px; color: #262626"
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
          content="Award"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement
          name="institution"
          before="Awarding Institution"
          :rules="['required']"
        />
        <TextElement
          name="name"
          before="Award Name"
          :rules="['required']"
        /> 
        <DateElement
        name="date_awarded"
        before="Date Awarded"
        :rules="['required']"
        >
        <template #addon-before>
          <v-icon class="mx-n1" color="#a5adb3">mdi-calendar</v-icon>
        </template>
      </DateElement>
      
      <TextareaElement
        name="description"
        before="Award Description"
        :rules="['required']"
      /> 
      
        <GroupElement class="actions-container" name="button_container">
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

<style scoped>
.actions-container {
  margin-top: 20px;
}
</style>

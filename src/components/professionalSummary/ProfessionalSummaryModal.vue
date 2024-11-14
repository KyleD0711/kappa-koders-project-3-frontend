<script setup>
import { ref, defineEmits } from "vue";
import professionalSummaryServices from "../../services/professionalSummaryServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
  professionalSummary: {
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
    id: props.professionalSummary.id,
    ...item.value,
  };
  if (data.id === null || data.id === undefined || data.id === "") {
    addItem(data);
  } else {
    updateItem(data);
  }
};

const addItem = async (data) => {
  await professionalSummaryServices
    .createProfessionalSummary(data)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const updateItem = async (item) => {
  await professionalSummaryServices
    .updatProfessionalSummary(item)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

onMounted(() => {
  if (props.professionalSummary.id != null) {
    item.value = props.professionalSummary;
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
          name="name"
          content="Professional Summary"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextareaElement
          name="summary"
          :autogrow="true"
          :rules="['required']"
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

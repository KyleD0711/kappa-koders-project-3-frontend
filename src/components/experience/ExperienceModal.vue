<script setup>
import { ref, onMounted } from "vue";
import experienceServices from "../../services/experienceServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { Validator } from "@vueform/vueform";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
  experience: {
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
    id: props.experience.id,
    ...item.value,
  };
  if (data.id === null || data.id === undefined || data.id === "") {
    addItem(data);
  } else {
    updateItem(data);
  }
};

const addItem = async (data) => {
  await experienceServices
    .createExperience(data)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const updateItem = async (item) => {
  await experienceServices
    .updateExperience(item)
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
    return "Date Start must be before Date End";
  }

  check(value) {
    const date1 = new Date(value.date_start);
    const date2 = new Date(value.date_end);

    return date1 < date2;
  }
};

onMounted(() => {
  if (props.experience.id != null) {
    item.value = props.experience;
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
          name="experience_title"
          content="Experience"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement name="employer" before="Employer" :rules="['required']" />
        <TextElement
          name="position_title"
          before="Position Title"
          :rules="['required']"
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
            name="date_end"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
            before="Date End"
            :rules="['required']"
          ></DateElement>
        </GroupElement>
        <StaticElement name="spacer"></StaticElement>
        <GroupElement name="button_container">
          <ButtonElement
            secondary
            class="cancelButtons"
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
            class="positiveButtons"
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

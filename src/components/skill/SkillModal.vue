<script setup>
import { ref, defineEmits, onMounted } from "vue";
import skillServices from "../../services/skillServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { Validator } from "@vueform/vueform";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
  skill: {
    type: Object,
    required: true,
  },
});

const item = ref({});
const proficiency_levels = ["Beginner", "Intermediate", "Advanced"];
const errorMsg = ref("");

const closeDialog = () => {
  isVisible.value = !isVisible.value;
};

const submitForm = async () => {
  const data = {
    id: props.skill.id,
    ...item.value,
  };
  if (data.id === null || data.id === undefined || data.id === "") {
    addItem(data);
  } else {
    updateItem(data);
  }
};

const addItem = async (data) => {
  await skillServices
    .createSkill(data)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const updateItem = async (item) => {
  await skillServices
    .updateSkill(item)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const descriptionValidator = class extends Validator {
  get msg() {
    return "Description must be between 0 and 45 characters long";
  }
  check(value) {
    if (value == null || (value.length >= 0 && value.length <= 45)) {
      return true;
    } else {
      return false;
    }
  }
};

onMounted(() => {
  if (props.skill.id != null) {
    item.value = props.skill;
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
          name="skill_title"
          content="Skill"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement 
          name="name" 
          before="Name" 
          :rules="['required']" />
        <TextElement
          name="description"
          before="Description"
          :rules="[descriptionValidator]"
        ></TextElement>
        <SelectElement
          name="proficiency_level"
          :search="true"
          :items="proficiency_levels"
          :native="false"
          before="Proficiency Level"
        ></SelectElement>
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

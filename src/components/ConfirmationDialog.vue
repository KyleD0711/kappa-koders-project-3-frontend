<script setup>
import { ref, onMounted, computed } from "vue";

// const props = defineProps(["action", "show"]);
const props = defineProps({
  action: {
    type: String,
    default: "",
  },
  entity: {
    type: String,
    default: "",
  },
  show: Boolean,
});
const emit = defineEmits(["action", "cancel", "show"]);

const buttonText = ref("Save");
const showDialog = computed(() => props.show);

const cancel = () => {
  emit("cancel");
};

const performAction = () => {
  emit("action");
};

onMounted(() => {
  buttonText.value = props.action
});
</script>

<template>
  <div>
    <v-dialog v-model="showDialog" persistent>
      <v-card class="mx-auto">
        <v-card-title class="w-auto mx-auto ma-4">
          Are you sure you want to {{ props.action }} {{props.entity}}?
        </v-card-title>

        <v-container class="w-75 mx-auto">
          <v-btn
            color="secondary"
            class="w-25 mx-auto float-left"
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="accent"
            class="w-25 mx-auto float-right"
            @click="performAction"
          >
            {{ buttonText }}
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

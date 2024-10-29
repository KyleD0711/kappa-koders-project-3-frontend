<script setup>
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const closeDialog = () => {
  isVisible.value = !isVisible.value;
};
</script>
<template>
  <v-dialog v-model="isVisible">
    <v-card :color="'#D9D9D9'" variant="tonal">
      <v-card-item><v-card-title>Education</v-card-title> </v-card-item>
      <v-card-actions>
        <v-btn @click="closeDialog" color="primary">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

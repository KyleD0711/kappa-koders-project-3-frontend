<script setup>
import { ref, defineEmits } from "vue";
import linkServices from "../../services/linkServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { Validator } from "@vueform/vueform";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
    link: {
        type: Object,
        required: true,
    },
}),

const item = ref({}); 

</script>

<template>


    
</template>
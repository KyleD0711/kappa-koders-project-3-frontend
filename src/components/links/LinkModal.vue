<script setup>
import { ref, defineEmits } from "vue";
import linkServices from "../../services/linkServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
    link: {
        type: Object,
        required: true,
    },
}),

 item = ref({}); 
const errorMsg = ref("");

const closeDialog = () => {
  isVisible.value = !isVisible.value;
};

const submitForm = async () => {
  const data = {
    id: props.link.id,
    ...item.value,
  };
  if (data.id === null || data.id === undefined || data.id === "") {
    addItem(data);
  } else {
    updateItem(data);
  }
};

const addItem = async (data) => {
  await linkServices
    .createLink(data)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const updateItem = async (item) => {
  await linkServices
    .updateLink(item)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

onMounted(() => {
  if (props.link.id != null) {
    item.value = props.link;
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
          content="Link Name"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement
          name="institution"
          before="Institution"
          :rules="['required']"
        />
        <StaticElement
          name="url"
          content="URL"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement
          name="URL"
          before="URL"
          :rules="['required']"
        />

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
<script setup>
import { ref, defineEmits, onMounted } from "vue";
import { useRouter } from "vue-router";
import ResumeServices from "../../services/resumeServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { Validator } from "@vueform/vueform";
import userProfileServices from "../../services/userProfileServices";
import Utils from "../../config/utils";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const router = useRouter();

const userProfile = ref(null); // Store userProfile data

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
  await fetchUserProfile();
  const data = {
    ...item.value,
    metadata: {
      fName: userProfile.value.fName || "", 
      lName: userProfile.value.lName || "", 
      email: Utils.getStore("user").email, 
      phone_number: userProfile.value.phoneNum || "", 
      render_fields: [],
      section_dividers: false,
    },
    templateId: 1, // default to template1
  };

  addResume(data);
};

const addResume = async (data) => {
  await ResumeServices
    .createResume(data)
    .then((response) => {
      isVisible.value = !isVisible.value;
      router.push({name: 'editResume', params: {resumeId: response.data.id}})
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

// Fetch user profile data on mounted
const fetchUserProfile = async () => {
  try {
    const userId = Utils.getStore("user").userId; // Get user ID from local storage
    const response = await userProfileServices.getUserProfile(userId);
    userProfile.value = response; // Store the user profile data
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};


const nameValidator = class extends Validator {
  get msg() {
    return "Name must be under 35 characters long"; 
  }

  check(value) {
    return value.length <= 45;
  }
};

onMounted(() => {
  fetchUserProfile();
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
          content="Add Resume"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement name="name" before="Name" :rules="['required', nameValidator]" />
        
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

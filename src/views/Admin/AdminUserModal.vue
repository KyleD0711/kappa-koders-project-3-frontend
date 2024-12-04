<script setup>
import { ref, defineEmits } from "vue";
import userServices from "../../services/userServices";
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const emit = defineEmits(["submitForm"]);

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
}),

 item = ref({}); 
const errorMsg = ref("");
let showYesModal = ref(false);

const closeDialog = () => {
  isVisible.value = false;
};

const submitForm = async () => {
  const data = {
    id: props.user.id,
    ...item.value,
  };
  if (data.id === null || data.id === undefined || data.id === "") {
    addItem(data);
  } else {
    updateItem(data);
  }
};

const addItem = async (data) => {
  await userServices
    .createUser(data)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

const updateItem = async (item) => {
  await userServices
    .updateUser(item)
    .then(() => {
      isVisible.value = !isVisible.value;
      emit("submitForm");
    })
    .catch((err) => {
      errorMsg.value = err;
    });
};

onMounted(() => {
  if (props.user.id != null) {
    item.value = props.user;
  }
  showYesModal.value = false;

});

const toggleModal = () => {
  showYesModal.value = true;
}

const modalYes = async () => {
  await submitForm()
  .then(() =>  {
    console.log(isVisible.value);  
  })
  showYesModal.value = false;
}


</script>

<template>

<v-dialog v-model="isVisible" max-width="60%">
    <v-card
      style="background-color: #d9d9d9; border-radius: 10px; padding: 20px"
    >
      <Vueform
        size="md"
        :endpoint="false"
        @submit="toggleModal"
        :display-errors="false"
        v-model="item"
        sync
      >

      <StaticElement
          name="user"
          content="User"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement
          name="email"
          before="Email"
          :rules="['required']"
        />
        <CheckboxElement
            name="admin"
            before="Admin"
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

        <div v-show="showYesModal" class="confirmation-modal" id="testModal">
          <div class="modal-content">
            <p color="#141212">Are you sure?</p>
            <br>
            <button @click="modalYes" style="margin-right: 20px; color: #141212">Yes</button>
            <button @click="closeDialog" style="color: #141212">No</button>
          </div>
        </div>



        </GroupElement>
        <StaticElement name="errormsg" v-if="errorMsg"
          ><span style="color: red">{{ errorMsg }}</span></StaticElement
        >
      </Vueform>
    </v-card>
</v-dialog>

</template>

<style scoped>
.confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
</style>

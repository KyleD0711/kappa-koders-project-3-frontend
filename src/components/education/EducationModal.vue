<script setup>
import { useModalStore } from "../../store/modal.store";
import { storeToRefs } from "pinia";
const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const closeDialog = () => {
  isVisible.value = !isVisible.value;
};

const degreeItems = ["Masters", "Bachelors", "Associates"];

const submitForm = async (form$) => {
  const data = form$.data;

  console.log(data);
};
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
      >
        <StaticElement
          name="education_title"
          content="Education"
          tag="h1"
          align="center"
        ></StaticElement>
        <TextElement
          name="institution"
          before="Institution"
          :rules="['required']"
        />
        <SelectElement
          name="degree"
          :items="degreeItems"
          :native="false"
          before="Degree"
          :rules="['required']"
        ></SelectElement>
        <GroupElement
          name="date_container"
          description="Dates attended institution"
        >
          <DateElement
            name="dateFrom"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
            before="Date From"
            :rules="['required']"
          ></DateElement>
          <DateElement
            name="dateTo"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
            before="Date To"
            :rules="['required']"
          ></DateElement>
        </GroupElement>
        <TextElement
          name="gpa"
          add-class="gpa-field"
          before="GPA"
        ></TextElement>
        <TextareaElement
          name="coursework"
          before="Course Work"
        ></TextareaElement>
        <GroupElement name="button_container">
          <ButtonElement
            secondary="true"
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
            button-label="Create account"
            :full="true"
            size="md"
            :columns="{
              container: 6,
              label: 12,
              wrapper: 12,
            }"
          />
        </GroupElement>
      </Vueform>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { VCard, VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VIcon } from 'vuetify/components';
import { useModalStore } from "../../store/modal.store";
import EducationModal from '../education/EducationModal.vue';
import educationServices from '../../services/educationServices';
import { storeToRefs } from 'pinia'; 

const modalStore = useModalStore();
const { isVisible } = storeToRefs(modalStore);

const sections = ref([]);

const getEducation = async () => {
  try {
    const res = await educationServices.getAllEducationForUser();
    sections.value = [
      {
        title: 'Education',
        items: res.data.map(item => ({ name: item.institution, selected: true, data: item })),
        open: false,
      },
      // You can add additional sections for Experience, Skills, etc., if needed.
    ];
  } catch (err) {
    console.error(err);
  }
};

// Function to open the modal for editing
const editItem = (item) => {
  modalStore.education = item.data;
  isVisible.value = true;
};

onMounted(() => {
  getEducation();
});

watch(sections, (newSections) => {
    console.log("Sections updated:", JSON.stringify(newSections, null, 2));
}, { deep: true });
</script>

<template>
  <div class="resumeTitle">
    Resume Name
    <v-icon style="padding-left: 36%; font-size: 30px;" class="edit-icon">mdi-pencil</v-icon>
  </div>

  <draggable class="section-1" v-model="sections" tag="ul">
    <template #item="{ element: section }">
      <v-card class="mb-3">
        <v-expansion-panels>
          <v-expansion-panel v-model="section.open" class="section-0">
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-drag</v-icon>
              {{ section.title }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="section-1">
              <draggable class="item-list" v-model="section.items" tag="ul">
                <template #item="{ element: item }">
                    <v-card class="mb-3">
                        <li :key="item.name" class="list-item">
                        <div class="left-icons">
                            <v-icon>mdi-drag</v-icon>
                            <span>{{ item.name }}</span>
                        </div>
                        <div class="right-icons">
                            <v-icon @click="editItem(item)" class="edit-icon">mdi-pencil</v-icon>
                            <v-checkbox v-model="item.selected" class="v-checkbox pa-0 ma-0" />
                        </div>
                        </li>
                    </v-card>
                </template>
              </draggable>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </template>
  </draggable>

  <EducationModal v-if="isVisible" :education="modalStore.education" @submit-form="getEducation" />
</template>


<style>
.resumeTitle{
    color: white;
    padding-left: 5%;
    font-size: 30px;
}

.section-1 {
  background-color: #575757;
  display: block;
  color:white;
  flex-direction: column;
}

.section-0 {
    background-color: #403F3F;
    color:white;
}

.v-checkbox {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px; /* Adjust space between elements if needed */
}

.right-icons {
  display: flex;
  align-items: center;
  gap: 8px; /* Adjust space between pencil icon and checkbox */
}

</style>

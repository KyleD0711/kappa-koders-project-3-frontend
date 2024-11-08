<template>
  <v-app>
      <v-navigation-drawer
    app
    class="navigation-drawer"
    v-model:opened="open"
    :breakpoint="20"
    permanent
  >
    <v-list v-model:opened="open">
      <v-list-item>
        <v-list-item-title style="font-size: 16px;">
          {Resume Name}
          <v-icon style="padding-left:39%">mdi-pencil</v-icon>
        </v-list-item-title>
      </v-list-item>

      <v-list-group class="section-0 list-item-title" v-for="section in sections" :key="section.title" :value="section.title">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <div class="activator-content">
              <v-icon>mdi-drag</v-icon>
              <v-list-item-title>{{ section.title }}</v-list-item-title>
            </div>
          </v-list-item>
        </template>
        <v-list>
          <v-list-item
            class="section-1"
            v-for="item in section.items"
            :key="item.name"
          >
            <v-list-item-content class="list-item-content">
              <v-checkbox></v-checkbox>
              <v-list-item-title class="item-title">{{ item.name }}</v-list-item-title>
              <v-icon @click="editItem(item)" class="edit-icon">mdi-pencil</v-icon>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  </v-app>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const open = ref(['']);
    const sections = ref([
      {
        title: "Education",
        items: [
          { name: "High School", selected: true },
          { name: "Bachelor's Degree", selected: true },
        ],
      },
      {
        title: "Experience",
        items: [
          { name: "Internship", selected: true },
          { name: "Full-time Job", selected: true },
        ],
      },
      {
        title: "Personal Links",
        items: [{ name: "LinkedIn", selected: true }],
      },
      {
        title: "Honors/Awards",
        items: [{ name: "Dean's List", selected: true }],
      },
      {
        title: "Interests",
        items: [{ name: "Coding", selected: true }],
      },
    ]);

    return {
      open,
      sections,
    };
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  background-color: #262626;
  color: white;
  width: 100%;
}

.section-0 {
  background-color: #403F3F;
}

.section-1 {
  background-color: #575757;
  display: block;
  flex-direction: column;
  padding-left: 16px;
}

.list-item-content {
  display: flex;
  align-items: center;  /* Ensure items are vertically aligned */
  justify-content: space-between; /* Spread out elements */
  padding: 10px 0; /* Reduce padding around list items */
}

.item-content {
  display: flex;
  align-items: center;  /* Align icon and title inline */
  flex-grow: 1; /* Allow title to take available space */
}

.item-title {
  font-size: 14px; /* Smaller font size to fit better */
}

.checkbox .v-input--selection-controls__input {
  margin: 0;
  padding: 0;
}

.activator-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

</style>

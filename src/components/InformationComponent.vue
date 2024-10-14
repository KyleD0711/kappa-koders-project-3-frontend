<template>
  <div>
    <v-tooltip max-width="500px" bottom>
      <template #activator="{ on, attrs }">
        <v-icon class="mx-2" color="grey darken" dark v-bind="attrs" v-on="on">
          mdi-information
        </v-icon>
      </template>
      <span>{{ message }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "InformationComponent",
  props: {
    message: {
      type: String,
      default: "",
    },
  },
};
</script>

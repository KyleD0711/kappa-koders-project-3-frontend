<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ message }}</v-toolbar-title>
      </v-toolbar>
      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          id="name"
          v-model="group.name"
          :counter="50"
          label="name"
          hint="Name"
          persistent-hint
          required
        ></v-text-field>

        <v-text-field
          id="description"
          v-model="group.description"
          :counter="500"
          label="description"
          hint="Description..."
          persistent-hint
          required
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="addGroup"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel"> Cancel </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import GroupServices from "@/services/groupServices.js";
export default {
  data() {
    return {
      group: {},
      roles: ["admin"],
      message: "Add Group - enter data and click Save",
    };
  },
  methods: {
    addGroup() {
      GroupServices.addGroup(this.group)
        .then(() => {
          this.$router.push({ name: "groupList" });
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log(error);
        });
    },
    cancel() {
      this.$router.push({ name: "groupList" });
    },
  },
};
</script>

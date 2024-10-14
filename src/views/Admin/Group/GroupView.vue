<template>
  <div style="">
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ message }}</v-toolbar-title>
      </v-toolbar>
      <br />
      <v-btn color="accent" elevation="2" class="mr-4" @click="toEdit">
        Edit
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="deleteGroup(group.id, group.name)"
      >
        Delete
      </v-btn>

      <v-btn class="mr-4" @click="cancel"> Back </v-btn>

      <br /><br />

      <v-text-field
        id="name"
        v-model="group.name"
        :counter="50"
        label="Group Name"
        readonly
      ></v-text-field>

      <v-text-field
        id="description"
        v-model="group.description"
        :counter="500"
        label="Description"
        readonly
      ></v-text-field>
    </v-container>
  </div>
</template>

<script>
import GroupServices from "@/services/groupServices.js";
export default {
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      group: {},
      message: "View Topic - click Edit to update or Delete to remove group",
    };
  },
  created() {
    GroupServices.getGroup(this.id)
      .then((response) => {
        this.group = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.log("There was an error:", error.response);
      });
  },
  methods: {
    deleteGroup(id, fName) {
      let confirmed = confirm(`Are you sure you want to delete ${fName}`);
      if (confirmed) {
        GroupServices.deleteGroup(id)
          .then(() => {
            this.$router.push({ name: "groupList" });
          })
          .catch((error) => {
            console.log("There was an error:", error.response);
          });
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    toEdit() {
      this.$router.push({ name: "groupEdit", params: { id: this.group.id } });
    },
  },
};
</script>

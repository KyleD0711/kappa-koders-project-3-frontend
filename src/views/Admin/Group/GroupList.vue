<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ message }}</v-toolbar-title>
      </v-toolbar>
      <br /><br />
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="accent" elevation="2" class="mr-4" @click="addGroup">
            Add
          </v-btn>

          <v-btn class="mr-4" @click="cancel"> Back </v-btn>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="groups"
          :items-per-page="50"
          @click:row="rowClick"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import GroupServices from "@/services/groupServices.js";
export default {
  name: "App",
  data() {
    return {
      message:
        "Groups - click group to view or edit group or click Add to add new group",
      search: "",
      groups: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
      ],
    };
  },
  created() {
    this.getGroups();
  },
  methods: {
    getGroups() {
      GroupServices.getAllGroups()
        .then((response) => {
          this.groups = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    deleteGroup(id, name) {
      let confirmed = confirm(`Are you sure you want to delete ${name}`);
      if (confirmed) {
        GroupServices.deleteGroup(id)
          .then(() => {
            this.getGroups(this.start, this.length);
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      }
    },
    getPrevious() {
      if (this.start >= this.length) {
        this.start -= this.length;
        this.getGroups(this.start, this.length);
      }
    },
    getNext() {
      if (this.courses.length === this.length) {
        this.start += this.length;
        this.getGroups(this.start, this.length);
      }
    },
    rowClick: function (item, row) {
      row.select(true);
      this.$router.push({ name: "groupView", params: { id: item.id } });
    },
    addGroup() {
      this.$router.push({ name: "groupAdd" });
    },
    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

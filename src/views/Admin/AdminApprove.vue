<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ message }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <InformationComponent
          message="View information for potential tutors including the topics they have signed up for and approve or disable their application."
        ></InformationComponent>
      </v-toolbar>
      <br />

      <v-alert v-model="showAlert" dismissible :type="alertType">{{
        alert
      }}</v-alert>

      <br />
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
          <v-btn class="mr-4" @click="cancel()"> Back </v-btn>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="personroles"
          :items-per-page="50"
        >
          <template #[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"
              >mdi-pencil</v-icon
            >
            <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title
            >Approve Application for {{ editedPerson.fName }}
            {{ editedPerson.lName }}</v-card-title
          >
          <v-card-text>
            <br />
            <v-form ref="form" v-model="valid" lazy validation>
              <v-data-table
                :headers="topicHeaders"
                :items="editedPerson.persontopic"
                :hide-default-footer="true"
              >
              </v-data-table>

              <br />
              <v-text-field
                v-model="editedPerson.email"
                label="Email Address"
                readonly
              ></v-text-field>

              <v-text-field
                v-model="editedPerson.phoneNum"
                label="Phone Number"
                readonly
              ></v-text-field>

              <v-select
                v-model="editedItem.status"
                :items="StatusSelect"
                label="Status"
                required
              >
              </v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" @click="save()">Save</v-btn>
            <v-btn color="error" @click="dialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- <v-dialog v-model="dialogDelete" max-width="800">
        <v-card>
          <v-card-title class="text-h5"
            >Are you sure you want to delete {{ editedPerson.fName }}
            {{ editedPerson.lName }}'s application?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="closeDelete">Cancel</v-btn>
            <v-btn color="accent" text @click="deleteItemConfirm">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
    </v-container>
  </div>
</template>

<script>
import Utils from "@/config/utils.js";
import PersonServices from "@/services/personServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import InformationComponent from "../../components/InformationComponent.vue";

export default {
  name: "AdminApprove",
  components: {
    InformationComponent,
  },
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data: () => ({
    valid: false,
    message: "Approve Applications",
    StatusSelect: ["applied", "approved", "disabled"],
    showAlert: false,
    alert: "",
    alertType: "success",
    dialog: false,
    dialogDelete: false,
    expanded: [],
    user: {},
    search: "",
    group: {},
    headers: [
      { text: "First Name", value: "fName" },
      { text: "Last Name", value: "lName" },
      { text: "Status", value: "personrole[0].status" },
      { text: "Signed Contract", value: "personrole[0].agree" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    personroles: [],
    topicHeaders: [
      { text: "Topic", value: "topic.name" },
      { text: "Skill Level", value: "skillLevel" },
    ],
    persontopics: [],
    editedPerson: {},
    editedItem: {
      status: "",
    },
    defaultItem: {
      status: "",
    },
  }),
  computed: {},
  // watch: {
  //   dialog(val) {
  //     val || this.close();
  //   },
  //   dialogDelete(val) {
  //     val || this.closeDelete();
  //   },
  // },
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupByPersonRoleId();
    await this.getPersonRoles();
    console.log(this.personroles);
    if (this.$route.query !== undefined) {
      for (let i = 0; i < this.personroles.length; i++) {
        if (
          this.personroles[i].personrole[0].id ===
          parseInt(this.$route.query.personRoleId)
        ) {
          this.editedPerson = this.personroles[i];
          this.editedItem = this.personroles[i].personrole[0];
          this.dialog = true;
          return;
        }
      }
    }
  },
  methods: {
    async getGroupByPersonRoleId() {
      await PersonRoleServices.getGroupForPersonRole(this.id)
        .then(async (response) => {
          this.group = response.data[0].role.group;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    async getPersonRoles() {
      await PersonServices.getPendingTutorsForGroup(this.group.id)
        .then((response) => {
          this.personroles = response.data;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    editItem(item) {
      this.editedPerson = item;
      this.editedItem = item.personrole[0];
      this.dialog = true;
    },
    // deleteItem(item) {
    //   this.editedIndex = this.personroles.indexOf(item.id);
    //   this.editedPerson = Object.assign({}, item);
    //   this.editedItem = Object.assign({}, item.personrole[0]);
    //   this.dialogDelete = true;
    // },
    // async deleteItemConfirm() {
    //   this.personroles.splice(this.editedIndex, 1);
    //   await PersonRoleServices.deletePersonRole(this.editedItem.id)
    //     .then(() => {
    //       this.getPersonRoles();
    //       this.alertType = "success";
    //       this.alert =
    //         "You have successfully deleted " +
    //         this.editedPerson.fName +
    //         " " +
    //         this.editedPerson.lName +
    //         "'s application.";
    //       this.showAlert = true;
    //     })
    //     .catch((error) => {
    //       this.alertType = "error";
    //       this.alert = error.response.data.message;
    //       this.showAlert = true;
    //       console.log("There was an error:", error.response);
    //     });

    //   this.closeDelete();
    // },
    // close() {
    //   this.dialog = false;
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem);
    //     this.editedIndex = -1;
    //   });
    // },
    // closeDelete() {
    //   this.dialogDelete = false;
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem);
    //     this.editedIndex = -1;
    //   });
    // },
    async save() {
      await PersonRoleServices.updatePersonRole(
        this.editedItem.id,
        this.editedItem
      )
        .then(() => {
          this.alertType = "success";
          this.alert =
            "You have successfully updated " +
            this.editedPerson.fName +
            " " +
            this.editedPerson.lName +
            "'s application.";
          this.showAlert = true;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
      await this.getPersonRoles();
      this.dialog = false;
    },
    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

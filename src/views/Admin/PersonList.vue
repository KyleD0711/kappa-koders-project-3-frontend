<template>
  <div>
    <v-container>
      <v-card-title class="text-h4 font-weight-bold pt-4 pb-6 pl-0 accent--text"
        >{{ title }}
        <InformationComponent
          :message="'View, edit, and add people for ' + group.name"
        ></InformationComponent
      ></v-card-title>
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
          <!-- ADD BACK IF SUPERADMIN CHECK -->
          <v-btn color="accent" class="mr-4" elevation="2" @click="addPerson">
            Add Admin
          </v-btn>
        </v-card-title>
        <v-dialog v-model="personDialog" persistent max-width="1200px">
          <PersonDialogBody
            :sent-person="selectedPerson"
            :sent-bool="isPersonDialogEdit"
            :sent-group="group"
            :sent-group-roles="groupRoles"
            @closePersonDialog="personDialog = false"
            @saveOrAddPerson="saveOrAddPerson"
          ></PersonDialogBody>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="persons"
          :items-per-page="50"
          @click:row="rowClick"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Utils from "@/config/utils.js";
import RoleServices from "@/services/roleServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import PersonServices from "@/services/personServices.js";
import InformationComponent from "../../components/InformationComponent.vue";
import PersonDialogBody from "../../components/Admin/Person/PersonDialogBody.vue";

export default {
  name: "App",
  components: { InformationComponent, PersonDialogBody },
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      title: " People",
      personDialog: false,
      isPersonDialogEdit: true,
      selectedPerson: {},
      user: {},
      search: "",
      persons: [],
      group: {},
      groupRoles: [],
      isSuperAdmin: false,
      headers: [
        { text: "Name", value: "fullName" },
        { text: "Email Address", value: "email" },
      ],
    };
  },
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupByPersonRoleId();
    await this.getPeopleForGroup();
    await this.getRolesForGroup();
    this.findIfSuperAdmin();
    this.title = this.group.name + this.title;
  },
  methods: {
    findIfSuperAdmin() {
      let current = this.user.access.filter((access) =>
        access.name.includes(this.group.name)
      );
      for (let i = 0; i < current.length; i++) {
        if (current[i] === "superadmin" || current[i] === "Superadmin")
          this.isSuperAdmin = true;
      }
    },
    async getRolesForGroup() {
      await RoleServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.groupRoles = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async getGroupByPersonRoleId() {
      await PersonRoleServices.getGroupForPersonRole(this.id)
        .then(async (response) => {
          this.group = response.data[0].role.group;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    getPeopleForGroup() {
      PersonServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.persons = response.data;
          for (let i = 0; i < this.persons.length; i++) {
            this.persons[i].fullName =
              this.persons[i].fName + " " + this.persons[i].lName;
          }
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    rowClick: function (item) {
      this.isPersonDialogEdit = true;
      this.selectedPerson = item;
      this.personDialog = true;
    },
    addPerson() {
      this.selectedPerson = {
        fName: "",
        lName: "",
        email: "",
        phoneNum: "",
        textOptIn: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.isPersonDialogEdit = false;
      this.personDialog = true;
    },
    async saveOrAddPerson(person, isEdit) {
      person.groupId = this.group.id;
      if (isEdit) {
        await PersonServices.updatePerson(person.id, person)
          .then(async () => {
            this.personDialog = false;
            await this.getPeopleForGroup();
          })
          .catch((error) => {
            this.title = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      } else {
        await PersonServices.addPerson(person)
          .then(async (response) => {
            let personRole = {
              status: "approved",
              agree: true,
              dateSigned: new Date(),
              roleId: this.groupRoles.filter((role) => role.type === "Admin")[0]
                .id,
              personId: response.data.id,
            };
            await PersonRoleServices.addPersonRole(personRole)
              .then(async () => {
                this.personDialog = false;
                await this.getPeopleForGroup();
              })
              .catch((error) => {
                this.message = error.response.data.message;
                console.log("There was an error:", error.response);
              });
          })
          .catch((error) => {
            this.title = error;
            console.log(error);
          });
      }
    },
  },
};
</script>

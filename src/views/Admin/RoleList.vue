<template>
  <div>
    <v-container>
      <v-card-title class="text-h4 font-weight-bold pt-4 pb-6 pl-0 accent--text"
        >{{ `${user.selectedGroup} Roles` }}
        <InformationComponent
          :message="'View, edit and add roles for ' + group.name + '.'"
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
          <v-btn color="accent" class="mr-4" elevation="2" @click="addRole">
            Add
          </v-btn>
        </v-card-title>
        <v-dialog v-model="roleDialog" persistent max-width="800px">
          <RoleDialogBody
            :sent-role="selectedRole"
            :sent-bool="isRoleDialogEdit"
            @closeRoleDialog="roleDialog = false"
            @saveOrAddRole="saveOrAddRole"
          ></RoleDialogBody>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="roles"
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
import RoleDialogBody from "../../components/Admin/RoleDialogBody.vue";
import InformationComponent from "../../components/InformationComponent.vue";

export default {
  name: "App",
  components: { RoleDialogBody, InformationComponent },
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      message: "",
      roleDialog: false,
      isRoleDialogEdit: true,
      selectedRole: {},
      search: "",
      roles: [],
      group: {},
      user: {},
      headers: [{ text: "Type", value: "type" }],
    };
  },
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupByPersonRoleId();
    await this.getRolesForGroup();
  },
  methods: {
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
    async getRolesForGroup() {
      await RoleServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.roles = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    rowClick: function (item) {
      this.isRoleDialogEdit = true;
      this.selectedRole = item;
      this.roleDialog = true;
    },
    addRole() {
      this.selectedRole = {
        type: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: this.group.id,
      };
      this.isRoleDialogEdit = false;
      this.roleDialog = true;
    },
    async saveOrAddRole(role, isEdit) {
      role.groupId = this.group.id;
      if (isEdit) {
        await RoleServices.updateRole(role.id, role)
          .then(async () => {
            this.roleDialog = false;
            await this.getRolesForGroup();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      } else {
        await RoleServices.addRole(role)
          .then(async () => {
            this.roleDialog = false;
            await this.getRolesForGroup();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log(error);
          });
      }
    },
  },
};
</script>

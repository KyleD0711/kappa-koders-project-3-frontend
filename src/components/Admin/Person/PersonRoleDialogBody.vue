<template>
  <v-card>
    <v-card-title class="primary white--text mb-6">{{
      isEdit
        ? "Edit " + personRole.type + " Role for " + personName
        : "Add a Role for " + personName
    }}</v-card-title>
    <v-card-text>
      <v-select
        v-if="!isEdit"
        id="role"
        v-model="selectedRole"
        :items="groupRoles"
        item-text="type"
        item-value="id"
        return-object
        label="Role"
      ></v-select>
      <v-select
        id="status"
        v-model="selectedStatus"
        :disabled="isDisabled"
        :items="
          isDisabled
            ? [{ value: 'disabled', statusName: 'disabled' }]
            : statuses
        "
        item-text="statusName"
        return-object
        label="Status"
      ></v-select>
    </v-card-text>

    <v-card-actions class="pb-4">
      <v-spacer></v-spacer>
      <v-btn
        v-if="isEdit"
        color="error"
        @click="
          isDisabled
            ? changePersonRoleStatus('approved')
            : (disableConfirmDialog = true)
        "
        >{{ isDisabled ? "Enable Role" : "Disable Role" }}</v-btn
      >
      <v-btn color="grey white--text" @click="$emit('closePersonRoleDialog')">
        {{ isEdit ? "Discard Changes" : "Cancel" }}
      </v-btn>
      <v-btn color="accent" @click="saveOrAddPersonRole()">{{
        isEdit ? "Save Changes" : "Add Role"
      }}</v-btn>
    </v-card-actions>
    <v-dialog v-model="disableConfirmDialog" persistent max-width="750px">
      <DeleteConfirmationComponent
        type="personrole"
        :item="{ ...personRole, ...{ personName: personName } }"
        @handleReturningCancel="disableConfirmDialog = false"
        @handleReturningSuccess="
          isDisabled
            ? changePersonRoleStatus('approved')
            : changePersonRoleStatus('disabled')
        "
      ></DeleteConfirmationComponent>
    </v-dialog>
  </v-card>
</template>

<script>
import DeleteConfirmationComponent from "../../DeleteConfirmationComponent.vue";
export default {
  name: "PersonRoleDialogBody",
  components: { DeleteConfirmationComponent },
  props: {
    sentBool: { type: [Boolean], default: false },
    sentPersonRole: {
      type: [Object],
      default() {
        return {
          agree: true,
          personId: 0,
          personRolePrivilege: [],
          roleId: 0,
          status: "",
          type: "",
        };
      },
    },
    sentPersonName: {
      type: [String],
      default: "test",
    },
    sentGroupRoles: {
      type: [Array],
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      personName: this.sentPersonName,
      personRole: this.sentPersonRole,
      isDisabled: this.selectedStatus === "disabled" ? true : false,
      tutor: false,
      groupRoles: this.sentGroupRoles,
      isEdit: this.sentBool,
      selectedRole: {
        value: this.sentPersonRole.type,
        roleName: this.sentPersonRole.type,
      },
      roles: [],
      selectedStatus: {
        value: this.sentPersonRole.status,
        statusName: this.sentPersonRole.status,
      },
      statuses: [
        { value: "approved", statusName: "approved" },
        { value: "applied", statusName: "applied" },
      ],
      disableConfirmDialog: this.selectedStatus === "disabled" ? true : false,
    };
  },
  watch: {
    sentPersonName(newPersonName) {
      this.personName = newPersonName;
    },
    sentPersonRole(newPersonRole) {
      this.personRole = newPersonRole;
      this.selectedRole = {
        id: this.sentPersonRole.roleId,
        type: this.sentPersonRole.type,
      };
      this.selectedStatus = {
        value: this.sentPersonRole.status,
        statusName: this.sentPersonRole.status,
      };
      this.isDisabled =
        this.sentPersonRole.status === "disabled" ? true : false;
    },
    sentBool(newVal) {
      this.isEdit = newVal;
    },
    sentGroupRoles(newGroupRoles) {
      this.groupRoles = newGroupRoles;
    },
  },
  mounted() {
    this.selectedRole = {
      id: this.sentPersonRole.roleId,
      type: this.sentPersonRole.type,
    };
    this.selectedStatus = {
      value: this.sentPersonRole.status,
      statusName: this.sentPersonRole.status,
    };
    this.isDisabled = this.sentPersonRole.status === "disabled" ? true : false;
  },
  methods: {
    saveOrAddPersonRole() {
      this.personRole.type = this.selectedRole.type;
      this.personRole.roleId = this.selectedRole.id;
      this.personRole.status = this.selectedStatus.statusName;

      this.$emit("saveOrAddPersonRole", this.personRole, this.isEdit);
    },
    changePersonRoleStatus(status) {
      this.personRole.status = status;
      this.isDisabled = !this.isDisabled;
      this.disableConfirmDialog = false;
      this.$emit("changePersonRoleStatus", this.personRole);
    },
  },
};
</script>

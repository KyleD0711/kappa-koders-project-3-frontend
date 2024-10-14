<template>
  <v-card>
    <v-card-title class="primary white--text mb-6">{{
      (isEdit ? "Delete Privilege for " : "Add a Privilege for ") + personName
    }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-if="isEdit"
        id="privilege"
        :value="selectedPrivilege.privilege"
        disabled
        label="Privilege"
      ></v-text-field>
      <v-select
        v-if="!isEdit"
        id="privilege"
        v-model="selectedPrivilege.privilege"
        :items="privileges"
        label="Privilege"
      ></v-select>
      <v-select
        id="associatedRole"
        v-model="selectedPrivilege.personroleId"
        :items="personRoles"
        item-text="type"
        item-value="personrole[0].id"
        label="Associated Role"
      ></v-select>
    </v-card-text>

    <v-card-actions class="pb-4">
      <v-spacer></v-spacer>
      <v-btn
        v-if="isEdit"
        color="error white--text"
        @click="$emit('deletePersonPrivilege', selectedPrivilege)"
      >
        {{ "Delete Privilege" }}
      </v-btn>
      <v-btn
        color="grey white--text"
        @click="$emit('closePersonPrivilegeDialog')"
      >
        {{ isEdit ? "Discard Changes" : "Cancel" }}
      </v-btn>
      <v-btn color="accent" @click="saveOrAddPersonRolePrivilege()">
        {{ isEdit ? "Save Changes" : "Add Privilege" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "PersonPrivilegeDialogBody",
  components: {},
  props: {
    sentBool: { type: [Boolean], default: false },
    sentPersonName: {
      type: [String],
      default: "test",
    },
    sentPersonRoles: {
      type: [Array],
      default() {
        return [];
      },
    },
    sentPersonPrivilege: {
      type: [Object],
      default() {
        return {
          privilege: "",
          personroleId: 0,
        };
      },
    },
  },
  data() {
    return {
      isEdit: this.sentBool,
      personName: this.sentPersonName,
      personRoles: this.sentPersonRoles,
      personPrivilege: this.sentPersonPrivilege,
      privileges: [
        "Make flexible slots that allow for shorter appointments",
        "Receive notifications for applications",
        "Receive notifications for requests",
        "Sign up students for appointments",
      ],
      selectedPrivilege: this.sentPersonPrivilege,
      selectedRole: "",
    };
  },
  watch: {
    sentPersonName(newPersonName) {
      this.personName = newPersonName;
    },
    sentPersonRoles(newPersonRoles) {
      this.personRoles = newPersonRoles;
    },
    sentBool(newVal) {
      this.isEdit = newVal;
    },
    sentPersonPrivilege(newPriv) {
      this.selectedPrivilege = newPriv;
    },
  },
  methods: {
    saveOrAddPersonRolePrivilege() {
      this.$emit(
        "saveOrAddPersonRolePrivilege",
        this.selectedPrivilege,
        this.isEdit
      );
    },
  },
};
</script>

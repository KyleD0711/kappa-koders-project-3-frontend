<template>
  <v-card>
    <v-card-title class="primary white--text mb-6 headline">{{
      isEdit ? `Edit Role - ${role.type}` : "Add A New Role"
    }}</v-card-title>
    <v-card-text>
      <v-text-field
        id="type"
        :value="role.type"
        :counter="50"
        label="Type"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey white--text" @click="$emit('closeRoleDialog')">
        {{ isEdit ? "Discard Changes" : "Cancel" }}
      </v-btn>
      <v-btn color="accent" @click="saveOrAddRole()">{{
        isEdit ? "Save Changes" : "Add Role"
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "RoleDialogBody",
  components: {},
  props: {
    sentBool: { type: [Boolean], default: false },
    sentRole: {
      type: [Object],
      default() {
        return {
          type: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          groupId: 1,
        };
      },
    },
  },
  data() {
    return {
      role: this.sentRole,
      isEdit: this.sentBool,
    };
  },
  watch: {
    sentRole(newRole) {
      this.role = newRole;
    },
    sentBool(newVal) {
      this.isEdit = newVal;
    },
  },
  created() {},
  methods: {
    saveOrAddRole() {
      this.role.type = document.getElementById("type").value;

      if (this.isEdit) {
        this.role.updatedAt = new Date();
      }

      this.$emit("saveOrAddRole", this.role, this.isEdit);
    },
  },
};
</script>

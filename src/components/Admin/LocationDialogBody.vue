<template>
  <v-card>
    <v-card-title class="primary white--text mb-6 headline">{{
      isEdit ? `Edit Location - ${location.name}` : "Add A New Location"
    }}</v-card-title>
    <v-card-text>
      <v-text-field
        id="name"
        :value="location.name"
        :counter="50"
        label="Name"
      ></v-text-field>

      <v-text-field
        id="building"
        :value="location.building"
        :counter="50"
        label="Building"
      ></v-text-field>

      <v-text-field
        id="description"
        :value="location.description"
        :counter="100"
        label="Description"
      ></v-text-field>

      <v-select
        id="type"
        v-model="selectedBuilding"
        :items="types"
        item-text="typeName"
        return-object
        label="Type"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="isEdit"
        color="error"
        @click="
          isDisabled
            ? changeLocationStatus('active')
            : (disableConfirmDialog = true)
        "
        >{{ isDisabled ? "Enable Location" : "Disable Location" }}</v-btn
      >
      <v-btn color="grey white--text" @click="$emit('closeLocationDialog')">
        {{ isEdit ? "Discard Changes" : "Cancel" }}
      </v-btn>
      <v-btn color="accent" @click="saveOrAddLocation()">{{
        isEdit ? "Save Changes" : "Add Location"
      }}</v-btn>
    </v-card-actions>

    <v-dialog v-model="disableConfirmDialog" persistent max-width="750px">
      <DeleteConfirmationComponent
        type="location"
        :item="location"
        @handleReturningCancel="disableConfirmDialog = false"
        @handleReturningSuccess="
          isDisabled
            ? changeLocationStatus('active')
            : changeLocationStatus('disabled')
        "
      ></DeleteConfirmationComponent>
    </v-dialog>
  </v-card>
</template>

<script>
import DeleteConfirmationComponent from "../DeleteConfirmationComponent.vue";
export default {
  name: "LocationDialogBody",
  components: {
    DeleteConfirmationComponent,
  },
  props: {
    sentBool: { type: [Boolean], default: false },
    sentLocation: {
      type: [Object],
      default() {
        return {
          name: "",
          type: "",
          building: "",
          description: "",
          status: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          groupId: 1,
        };
      },
    },
  },
  data() {
    return {
      statuses: ["active", "disabled"],
      types: [
        { value: "In-Person", typeName: "In-Person" },
        { value: "Online", typeName: "Online" },
      ],
      location: this.sentLocation,
      isEdit: this.sentBool,
      isDisabled: this.sentLocation.status === "disabled" ? true : false,
      disableConfirmDialog: false,
      selectedBuilding: {
        value: this.sentLocation.type,
        typeName: this.sentLocation.type,
      },
    };
  },
  watch: {
    sentLocation(newLocation) {
      this.location = newLocation;
      this.selectedBuilding = {
        value: this.location.type,
        typeName: this.location.type,
      };
      this.isDisabled = this.location.status === "disabled" ? true : false;
    },
    sentBool(newVal) {
      this.isEdit = newVal;
    },
  },
  created() {},
  methods: {
    saveOrAddLocation() {
      this.location.name = document.getElementById("name").value;
      this.location.type = this.selectedBuilding.typeName;
      this.location.building = document.getElementById("building").value;
      this.location.description = document.getElementById("description").value;

      if (this.isEdit) {
        this.location.updatedAt = new Date();
      }

      this.$emit("saveOrAddLocation", this.location, this.isEdit);
    },
    changeLocationStatus(status) {
      this.location.status = status;
      this.isDisabled = !this.isDisabled;
      this.$emit("changeLocationStatus", this.location);
    },
  },
};
</script>

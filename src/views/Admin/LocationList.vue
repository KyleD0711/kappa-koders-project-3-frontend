<template>
  <div>
    <v-container>
      <v-card-title class="text-h4 font-weight-bold pt-4 pb-6 pl-0 accent--text"
        >{{ `${user.selectedGroup} Locations` }}
        <InformationComponent
          :message="'View, edit and add locations for ' + group.name + '.'"
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
          <v-btn color="accent" class="mr-4" elevation="2" @click="addLocation">
            Add
          </v-btn>
        </v-card-title>
        <v-dialog v-model="locationDialog" persistent max-width="800px">
          <LocationDialogBody
            :sent-location="selectedLocation"
            :sent-bool="isLocationDialogEdit"
            @closeLocationDialog="locationDialog = false"
            @saveOrAddLocation="saveOrAddLocation"
            @changeLocationStatus="changeLocationStatus"
          ></LocationDialogBody>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="locations"
          :items-per-page="50"
          @click:row="rowClick"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Utils from "@/config/utils.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import LocationServices from "@/services/locationServices.js";
import LocationDialogBody from "../../components/Admin/LocationDialogBody.vue";
import InformationComponent from "../../components/InformationComponent.vue";

export default {
  name: "App",
  components: { LocationDialogBody, InformationComponent },
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      locationDialog: false,
      isLocationDialogEdit: true,
      selectedLocation: {},
      search: "",
      message: "",
      locations: [],
      user: {},
      group: {},
      headers: [
        { text: "Name", value: "name" },
        { text: "Type", value: "type" },
        { text: "Building", value: "building" },
        { text: "Status", value: "status" },
      ],
    };
  },
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupByPersonRoleId();
    await this.getLocationsForGroup();
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
    async getLocationsForGroup() {
      await LocationServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.locations = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async changeLocationStatus(location) {
      await LocationServices.updateLocation(location.id, location)
        .then(async () => {
          this.locationDialog = false;
          await this.getLocationsForGroup();
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    // Commenting this out for now - we need to create a DB query to check if a topic
    // is related to any other data. If not, we can let them delete it.
    // deleteLocation(id, name) {
    //   let confirmed = confirm(`Are you sure you want to delete ${name}`);
    //   if (confirmed) {
    //     LocationServices.deleteLocation(id)
    //       .then(() => {
    //         this.getLocations(this.start, this.length);
    //       })
    //       .catch((error) => {
    //         this.message = error.response.data.message;
    //         console.log("There was an error:", error.response);
    //       });
    //   }
    // },
    rowClick: function (item) {
      this.isLocationDialogEdit = true;
      this.selectedLocation = item;
      this.locationDialog = true;
    },
    addLocation() {
      this.selectedLocation = {
        name: "",
        type: "",
        building: "",
        description: "",
        status: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: this.group.id,
      };
      this.isLocationDialogEdit = false;
      this.locationDialog = true;
    },
    async saveOrAddLocation(location, isEdit) {
      location.groupId = this.group.id;
      if (isEdit) {
        await LocationServices.updateLocation(location.id, location)
          .then(async () => {
            this.locationDialog = false;
            await this.getLocationsForGroup();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      } else {
        await LocationServices.addLocation(location)
          .then(async () => {
            this.locationDialog = false;
            await this.getLocationsForGroup();
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

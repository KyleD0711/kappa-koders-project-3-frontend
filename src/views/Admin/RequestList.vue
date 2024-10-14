<template>
  <div>
    <v-container>
      <v-card-title class="text-h4 font-weight-bold pt-4 pb-6 pl-0 accent--text"
        >{{ `${user.selectedGroup} Requests` }}
        <InformationComponent
          :message="
            'View requests from people in ' +
            user.selectedGroup +
            ' and mark them as In-Progress or Completed appropriately.'
          "
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
          <v-btn
            color="accent"
            class="mr-4"
            elevation="2"
            @click="
              hideCompleted = !hideCompleted;
              filterCompleted();
            "
          >
            {{ hideCompleted ? "Show " : "Hide " }} Completed
          </v-btn>
        </v-card-title>
        <v-dialog v-model="requestDialog" persistent max-width="800px">
          <RequestDialogBody
            :sent-request="selectedRequest"
            :person-role-id="id"
            :sent-bool="true"
            @closeRequestDialog="requestDialog = false"
            @saveOrAddRequest="saveRequest"
          ></RequestDialogBody>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="filteredRequests"
          :items-per-page="50"
          @click:row="rowClick"
        ></v-data-table>
      </v-card>
      <v-snackbar v-model="showAlert" rounded="pill">
        {{ alert }}
        <template #action="{ attrs }">
          <v-btn
            :color="
              alertType === 'success'
                ? 'green'
                : alertType === 'warning'
                ? 'yellow'
                : 'error'
            "
            text
            v-bind="attrs"
            @click="showAlert = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import Utils from "@/config/utils.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import RequestServices from "@/services/requestServices.js";
import InformationComponent from "../../components/InformationComponent.vue";
import RequestDialogBody from "../../components/RequestDialogBody.vue";
import { TimeFunctionsMixin } from "../../mixins/TimeFunctionsMixin";

export default {
  name: "AdminRequests",
  components: {
    InformationComponent,
    RequestDialogBody,
  },
  mixins: [TimeFunctionsMixin],
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      search: "",
      showAlert: false,
      alert: "",
      alertType: "success",
      hideCompleted: true,
      requestDialog: false,
      selectedRequest: {},
      message: "",
      user: {},
      headers: [
        { text: "Date", value: "date" },
        { text: "Time", value: "time" },
        { text: "Student", value: "fullName" },
        { text: "Problem", value: "problem" },
        { text: "Status", value: "status" },
      ],
      requests: [],
      filteredRequests: [],
    };
  },
  computed: {},
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupByPersonRoleId();
    await this.getRequestsForGroup();
    if (this.$route.query !== undefined) {
      for (let i = 0; i < this.requests.length; i++) {
        if (this.requests[i].id === parseInt(this.$route.query.requestId)) {
          this.selectedRequest = this.requests[i];
          this.requestDialog = true;
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
    async getRequestsForGroup() {
      await RequestServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.requests = response.data;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error: ", error.response.data.message);
        });

      for (let i = 0; i < this.requests.length; i++) {
        if (
          this.requests[i].topic === null ||
          this.requests[i].topic === undefined
        ) {
          this.requests[i].topic = {
            name: "None",
          };
        }

        if (
          this.requests[i].courseNum === null ||
          this.requests[i].courseNum === undefined
        ) {
          this.requests[i].courseNum = "None";
        }

        this.requests[
          i
        ].fullName = `${this.requests[i].person.fName} ${this.requests[i].person.lName}`;
        this.requests[i].date = this.formatReadableMonth(
          this.requests[i].createdAt
        );

        this.requests[i].time = this.formatReadableTimeFromSQL(
          this.requests[i].createdAt
        );
      }

      this.filterCompleted();
    },
    rowClick: function (item) {
      this.selectedRequest = item;
      this.requestDialog = true;
    },
    filterCompleted() {
      if (this.hideCompleted) {
        this.filteredRequests = this.requests.filter((request) => {
          return request.status !== "Completed";
        });
      } else {
        this.filteredRequests = this.requests;
      }
    },
    async saveRequest(request) {
      let tempRequest = {
        id: request.id,
        courseNum: request.courseNum,
        description: request.description,
        status: request.status,
        problem: request.problem,
        groupId: request.groupId,
        personId: request.personId,
        topicId: request.topicId,
      };
      await RequestServices.updateRequest(tempRequest.id, tempRequest)
        .then(() => {
          this.alertType = "success";
          this.alert =
            "You have successfully updated " + request.fullName + "'s request.";
          this.showAlert = true;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
      await this.getRequestsForGroup();
      this.requestDialog = false;
    },
  },
};
</script>

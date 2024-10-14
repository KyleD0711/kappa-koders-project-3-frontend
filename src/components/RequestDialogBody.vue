<template>
  <v-card>
    <v-card-title
      v-if="isAdminView"
      :class="
        (request.status === 'Received'
          ? 'error'
          : request.status === 'In-Progress'
          ? 'yellow'
          : request.status === 'Completed'
          ? 'darkblue'
          : 'primary') + ' white--text mb-2 headline'
      "
      >{{ `Request from ${request.fullName}` }}</v-card-title
    >
    <v-card-title
      v-else-if="!isAdminView"
      class="primary white--text mb-4 headline"
      >{{ `Send A Request to ${user.selectedGroup}` }}</v-card-title
    >
    <v-card-subtitle
      v-if="isAdminView"
      :class="
        (request.status === 'Received'
          ? 'error'
          : request.status === 'In-Progress'
          ? 'yellow'
          : request.status === 'Completed'
          ? 'darkblue'
          : 'primary') + ' white--text pb-2 mb-2'
      "
    >
      {{
        `Received on ${formatReadableDate(request.createdAt)} at ${
          request.time
        }`
      }}
    </v-card-subtitle>
    <v-card-text>
      <v-row v-if="isAdminView">
        <v-col>
          <div class="mt-2 align-center d-flex">
            <v-icon class="mr-2">mdi-email-outline</v-icon>
            <b class="mr-2">Email: </b>
            <a :href="'mailto:' + request.person.email">{{
              request.person.email
            }}</a>
          </div>
        </v-col>
        <v-col v-if="request.person.textOptIn">
          <div class="mt-2 align-center d-flex">
            <v-icon class="mr-2">mdi-phone</v-icon>
            <b class="mr-2">Phone Number: </b>
            {{ request.person.phoneNum }}
          </div>
        </v-col>
      </v-row>
      <v-select
        v-model="request.problem"
        class="mt-2"
        :items="problems"
        :label="isAdminView ? 'Problem' : 'Why are you making this request?'"
        prepend-icon="mdi-alert-outline"
        :readonly="isAdminView"
        required
        @change="resetEverything()"
      >
      </v-select>

      <v-text-field
        v-if="showCourseNumber"
        v-model="request.courseNum"
        :label="
          isAdminView
            ? 'Course Number'
            : 'Which course do you need tutoring for?'
        "
        prepend-icon="mdi-bookshelf"
        :readonly="isAdminView"
      ></v-text-field>

      <v-select
        v-if="showTopic"
        v-model="request.topicId"
        :items="topics"
        item-text="name"
        item-value="id"
        :label="
          isAdminView ? 'Topic' : 'Which topic corresponds to your course?'
        "
        :prepend-icon="
          isAdminView ? 'mdi-book-outline' : 'mdi-book-edit-outline'
        "
        :readonly="isAdminView"
      >
      </v-select>

      <v-textarea
        v-if="showDescription"
        v-model="request.description"
        :label="
          request.problem === problems[0]
            ? 'Which times would work for you?'
            : request.problem === problems[1]
            ? 'Do you have any additional comments about the missing topic?'
            : request.problem === problems[2]
            ? 'Please describe the issue you would like to report.'
            : request.problem === problems[3]
            ? 'What would you like to request?'
            : ''
        "
        rows="2"
        persistent-hint
        :prepend-icon="
          isAdminView ? 'mdi-comment-outline' : 'mdi-comment-edit-outline'
        "
        :readonly="isAdminView"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey white--text" @click="$emit('closeRequestDialog')">
        {{ isAdminView ? "Close" : "Cancel" }}
      </v-btn>
      <v-btn
        v-if="request.status !== 'Received'"
        color="error white--text"
        @click="
          request.status = 'Received';
          saveChanges = true;
        "
      >
        Mark Received
      </v-btn>
      <v-btn
        v-if="request.status !== 'In-Progress'"
        color="yellow white--text"
        @click="
          request.status = 'In-Progress';
          saveChanges = true;
        "
      >
        Mark In-Progress
      </v-btn>
      <v-btn
        v-if="request.status !== 'Completed'"
        color="darkblue white--text"
        @click="
          request.status = 'Completed';
          saveChanges = true;
        "
      >
        Mark Completed
      </v-btn>
      <v-btn
        color="accent"
        :disabled="
          isAdminView
            ? !saveChanges
            : request.problem === '' || request.description === ''
        "
        @click="saveOrAddRequest()"
        >{{ isAdminView ? "Save Changes" : "Send Request" }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import Utils from "@/config/utils.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import TopicServices from "@/services/topicServices.js";
import { TimeFunctionsMixin } from "../mixins/TimeFunctionsMixin";

export default {
  name: "RequestDialogBody",
  mixins: [TimeFunctionsMixin],
  props: {
    sentBool: { type: [Boolean], default: false },
    personRoleId: { type: [Number, String], default: 0 },
    sentRequest: {
      type: [Object],
      default() {
        return {
          id: 0,
          problem: "",
          courseNum: "",
          description: "",
          status: "Received",
          personId: null,
          topicId: null,
          groupId: null,
        };
      },
    },
  },
  data() {
    return {
      problems: [
        "No times work for me.",
        "The topic I am looking for is not here.",
        "I need to report an issue.",
        "Other",
      ],
      statuses: ["Received", "In-Progress", "Completed"],
      topics: [],
      group: {},
      request: this.sentRequest,
      isAdminView: this.sentBool,
      showCourseNumber: false,
      showDescription: false,
      showTopic: false,
      saveChanges: false,
    };
  },
  watch: {
    sentRequest(newRequest) {
      this.request = newRequest;
      this.resetEverything();
    },
    sentBool(newVal) {
      this.isAdminView = newVal;
    },
  },
  async created() {
    this.user = Utils.getStore("user");
    this.resetEverything();
    if (this.user.selectedRole.type !== "Tutor") {
      await this.getGroupByPersonRoleId();
      await this.getTopicsForGroup();
    }
  },
  methods: {
    resetEverything() {
      this.setShowCourseNumber();
      this.setShowDescription();
      this.setShowTopic();
    },
    setShowCourseNumber() {
      this.showCourseNumber = this.isAdminView
        ? this.request.courseNum !== null && this.request.courseNum !== ""
        : this.request.problem === this.problems[0] ||
          this.request.problem === this.problems[1] ||
          this.request.problem === this.problems[3];
    },
    setShowTopic() {
      this.showTopic = this.isAdminView
        ? this.request.topicId !== null
        : this.request.problem === this.problems[0] ||
          this.request.problem === this.problems[3];
    },
    setShowDescription() {
      this.showDescription =
        this.request.problem !== "" &&
        this.request.problem !== null &&
        this.request.problem !== undefined;
    },
    async getGroupByPersonRoleId() {
      await PersonRoleServices.getGroupForPersonRole(this.personRoleId)
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
    async getTopicsForGroup() {
      await TopicServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.topics = response.data;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    saveOrAddRequest() {
      this.request.groupId = this.group.id;
      if (!this.isAdminView) this.request.personId = this.user.userID;
      this.$emit("saveOrAddRequest", this.request);
    },
  },
};
</script>

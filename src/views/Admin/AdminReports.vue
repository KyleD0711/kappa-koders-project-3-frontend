<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ message }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <InformationComponent
          message="Select various criteria for appointments regarding dates, topics, statuses, tutors, and/or students.
          Click Filter and then click Download CSV.
          A CSV Report of the selected appointments will be saved to your Downloads file."
        ></InformationComponent>
      </v-toolbar>
      <br />
      <v-alert v-model="showAlert" dismissible :type="alertType">{{
        alert
      }}</v-alert>
      <v-row>
        <v-col md="4">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Date Range"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" range></v-date-picker>
          </v-menu>
        </v-col>
        <v-col md="4">
          <v-select
            v-model="selectedTopic"
            :items="topics"
            item-text="name"
            item-value="id"
            label="Topic"
          >
          </v-select>
        </v-col>
        <v-col md="4">
          <v-select
            v-model="selectedStatus"
            :items="status"
            item-text="title"
            item-value="id"
            label="Status"
          >
          </v-select>
        </v-col>
        <v-col md="4">
          <v-select
            v-model="selectedTutors"
            :items="tutors"
            item-text="fullName"
            item-value="fullName"
            chips
            multiple
            label="Tutors"
          >
          </v-select>
        </v-col>
        <v-col md="4">
          <v-select
            v-model="selectedStudents"
            :items="students"
            item-text="fullName"
            item-value="fullName"
            chips
            multiple
            label="Students"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-btn color="success" class="mr-4" @click="filter()"> Filter </v-btn>
      <br /><br />
      <vue-json-to-csv
        :json-data="selectedAppointments"
        :labels="labels"
        :csv-title="fileName"
      >
        <v-btn
          color="success"
          class="mr-4"
          :disabled="!isFiltered"
          @click="
            showAlert = true;
            alert = 'Your CSV Report has been successfully downloaded.';
            alertType = 'success';
            isFiltered = false;
            selectedStudents = [];
            selectedTutors = [];
            dates = [];
            selectedTopic = -1;
            selectedStatus = -1;
            getAllAppointmentsForGroup();
          "
        >
          Download CSV
        </v-btn>
      </vue-json-to-csv>
    </v-container>
  </div>
</template>

<script>
import VueJsonToCsv from "vue-json-to-csv";
import Utils from "@/config/utils.js";
import AppointmentServices from "@/services/appointmentServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import PersonServices from "@/services/personServices.js";
import TopicServices from "@/services/topicServices.js";
import InformationComponent from "../../components/InformationComponent.vue";
import { TimeFunctionsMixin } from "../../mixins/TimeFunctionsMixin";

export default {
  name: "AdminReports",
  components: {
    VueJsonToCsv,
    InformationComponent,
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
      message: "Create Reports",
      isFiltered: false,
      menu: false,
      showAlert: false,
      alertType: "success",
      alert: "",
      dates: [],
      group: {},
      user: {},
      topics: [],
      selectedTopic: -1,
      status: [
        { id: 0, name: "available", title: "Available" },
        { id: 1, name: "studentCancel,tutorCancel", title: "Canceled" },
        { id: 2, name: "booked,complete", title: "Complete" },
        { id: 3, name: "noShow", title: "No Show" },
        { id: 4, name: "pending", title: "Pending" },
        { id: 5, name: "studentCancel", title: "Student Cancel" },
        { id: 6, name: "tutorCancel", title: "Tutor Cancel" },
      ],
      selectedStatus: -1,
      selectedTutors: [],
      tutors: [],
      selectedStudents: [],
      students: [],
      fileName: "",
      today: "",
      appointments: [],
      selectedAppointments: [],
      labels: {
        date: { title: "Date" },
        startTime: { title: "Start" },
        endTime: { title: "End" },
        type: { title: "Type" },
        statusName: { title: "Status" },
        topicName: { title: "Topic" },
        locationName: { title: "Location" },
        locationBuilding: { title: "Building" },
        preSessionInfo: { title: "Pre Session Notes" },
      },
      headers: [
        { text: "Date", value: "date" },
        { text: "Start Time", value: "startTime" },
        { text: "End Time", value: "endTime" },
        { text: "Topic", value: "topic.name" },
      ],
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupByPersonRoleId();
    await this.getTopicsForGroup();
    await this.getAllAppointmentsForGroup();
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
    async setSelectedAppointments() {
      this.selectedAppointments = this.appointments;
      let biggestTutors = 0;
      let biggestStudents = 0;

      for (let i = 0; i < this.appointments.length; i++) {
        let appoint = this.appointments[i];
        appoint.students = [];
        appoint.tutors = [];
        appoint.sumStuFeedback = 0;
        appoint.numStuFeedback = 0;

        //make status field look nicer
        if (appoint.status === "booked") appoint.statusName = "Booked";
        else if (appoint.status === "complete") appoint.statusName = "Complete";
        else if (
          this.status.find((status) => status.name.includes(appoint.status)) !=
          null
        )
          appoint.statusName = this.status.find((status) =>
            status.name.includes(appoint.status)
          ).title;
        else appoint.statusName = "None";

        if (
          appoint.topic !== undefined &&
          appoint.topic !== null &&
          appoint.topic !== ""
        )
          this.selectedAppointments[i].topicName = appoint.topic.name;
        else this.selectedAppointments[i].topicName = "";

        if (
          appoint.location !== undefined &&
          appoint.location !== null &&
          appoint.location !== ""
        )
          this.selectedAppointments[i].locationName = appoint.location.name;
        else this.selectedAppointments[i].locationName = "";

        if (
          appoint.location !== undefined &&
          appoint.topic !== null &&
          appoint.location !== ""
        )
          this.selectedAppointments[i].locationBuilding =
            appoint.location.building;
        else this.selectedAppointments[i].locationBuilding = "";

        if (
          appoint.preSessionInfo === undefined ||
          appoint.preSessionInfo === null
        ) {
          this.selectedAppointments[i].preSessionInfo = "";
        }

        if (
          appoint.personappointment === undefined ||
          appoint.personappointment === null
        ) {
          this.selectedAppointments[i].tutor1 = "";
          this.selectedAppointments[i].tutor1FeedbackNum = "";
          this.selectedAppointments[i].tutor1FeedbackText = "";
          this.selectedAppointments[i].student1 = "";
          this.selectedAppointments[i].student1FeedbackNum = "";
          this.selectedAppointments[i].student1FeedbackText = "";
        } else {
          let tutIndex = 0,
            stuIndex = 0;
          for (let j = 0; j < appoint.personappointment.length; j++) {
            let pa = appoint.personappointment[j];
            if (pa.isTutor === true) {
              appoint.tutors[tutIndex] = {};
              appoint.tutors[tutIndex].title = "Tutor " + (tutIndex + 1);
              appoint.tutors[tutIndex].name =
                pa.person.fName + " " + pa.person.lName;
              appoint.tutors[tutIndex].feedbacknumber = pa.feedbacknumber;
              appoint.tutors[tutIndex].feedbacktext = pa.feedbacktext;

              tutIndex++;
            } else {
              appoint.students[stuIndex] = {};
              appoint.students[stuIndex].title = "Student " + (stuIndex + 1);
              appoint.students[stuIndex].name =
                pa.person.fName + " " + pa.person.lName;
              appoint.students[stuIndex].feedbacknumber = pa.feedbacknumber;
              appoint.students[stuIndex].feedbacktext = pa.feedbacktext;

              if (
                pa.feedbacknumber !== undefined &&
                pa.feedbacknumber !== null
              ) {
                appoint.sumStuFeedback += pa.feedbacknumber;
                appoint.numStuFeedback++;
              }

              stuIndex++;
            }
          }
        }

        if (biggestTutors < appoint.tutors.length)
          biggestTutors = appoint.tutors.length;

        if (biggestStudents < appoint.students.length)
          biggestStudents = appoint.students.length;

        // dynamically adds columns to the csv file depending on how many tutors/students were in the appointment
        for (let j = 0; j < appoint.tutors.length; j++) {
          this.selectedAppointments[i][`tutor${j + 1}`] =
            appoint.tutors[j].name;
          if (
            appoint.tutors[j].feedbacknumber === undefined ||
            appoint.tutors[j].feedbacknumber === null
          )
            this.selectedAppointments[i][`tutor${j + 1}FeedbackNum`] = "";
          else {
            this.selectedAppointments[i][`tutor${j + 1}FeedbackNum`] =
              appoint.tutors[j].feedbacknumber;
          }

          if (
            appoint.tutors[j].feedbacktext === undefined ||
            appoint.tutors[j].feedbacktext === null
          )
            this.selectedAppointments[i][`tutor${j + 1}FeedbackText`] = "";
          else
            this.selectedAppointments[i][`tutor${j + 1}FeedbackText`] =
              appoint.tutors[j].feedbacktext;

          if (
            this.labels[`tutor${j + 1}`] === undefined ||
            this.labels[`tutor${j + 1}`] === null
          ) {
            this.labels[`tutor${j + 1}`] = {};
            this.labels[`tutor${j + 1}`].title = appoint.tutors[j].title;

            this.labels[`tutor${j + 1}FeedbackNum`] = {};
            this.labels[`tutor${j + 1}FeedbackNum`].title =
              appoint.tutors[j].title + " Feedback Number";

            this.labels[`tutor${j + 1}FeedbackText`] = {};
            this.labels[`tutor${j + 1}FeedbackText`].title =
              appoint.tutors[j].title + " Feedback Text";
          }
        }

        // add average student feedback label
        this.labels.avgStuFeedback = {};
        this.labels.avgStuFeedback.title = "Average Student Feedback";

        for (let j = 0; j < appoint.students.length; j++) {
          this.selectedAppointments[i][`student${j + 1}`] =
            appoint.students[j].name;

          if (
            appoint.students[j].feedbacknumber === undefined ||
            appoint.students[j].feedbacknumber === null
          )
            this.selectedAppointments[i][`student${j + 1}FeedbackNum`] = "";
          else
            this.selectedAppointments[i][`student${j + 1}FeedbackNum`] =
              appoint.students[j].feedbacknumber;

          if (
            appoint.students[j].feedbacktext === undefined ||
            appoint.students[j].feedbacktext === null
          )
            this.selectedAppointments[i][`student${j + 1}FeedbackText`] = "";
          else
            this.selectedAppointments[i][`student${j + 1}FeedbackText`] =
              appoint.students[j].feedbacktext;

          if (
            this.labels[`student${j + 1}`] === undefined ||
            this.labels[`student${j + 1}`] === null
          ) {
            this.labels[`student${j + 1}`] = {};
            this.labels[`student${j + 1}`].title = appoint.students[j].title;

            this.labels[`student${j + 1}FeedbackNum`] = {};
            this.labels[`student${j + 1}FeedbackNum`].title =
              appoint.students[j].title + " Feedback Number";

            this.labels[`student${j + 1}FeedbackText`] = {};
            this.labels[`student${j + 1}FeedbackText`].title =
              appoint.students[j].title + " Feedback Text";
          }
        }
      }

      // set any undefined variables as empty strings
      for (let i = 0; i < this.selectedAppointments.length; i++) {
        let appoint = this.selectedAppointments[i];
        if (appoint.sumStuFeedback !== 0 && appoint.numStuFeedback !== 0)
          appoint.avgStuFeedback =
            parseInt(appoint.sumStuFeedback) / appoint.numStuFeedback;
        else appoint.avgStuFeedback = "";

        for (let j = 0; j < biggestTutors; j++) {
          if (
            appoint[`tutor${j + 1}`] === undefined ||
            appoint[`tutor${j + 1}`] === null
          ) {
            appoint[`tutor${j + 1}`] = "";
            appoint[`tutor${j + 1}FeedbackNum`] = "";
            appoint[`tutor${j + 1}FeedbackText`] = "";
          }
        }
        for (let j = 0; j < biggestStudents; j++) {
          if (
            appoint[`student${j + 1}`] === undefined ||
            appoint[`student${j + 1}`] === null
          ) {
            appoint[`student${j + 1}`] = "";
            appoint[`student${j + 1}FeedbackNum`] = "";
            appoint[`student${j + 1}FeedbackText`] = "";
          }
        }
      }
    },
    async getAllAppointmentsForGroup() {
      await AppointmentServices.getAllForGroup(this.group.id)
        .then(async (response) => {
          this.appointments = response.data;

          // put appointments in date and time order
          let temp = this.appointments.length;
          for (let i = 0; i < temp; i++) {
            for (let j = 0; j < temp - i - 1; j++) {
              if (this.appointments[j + 1].date < this.appointments[j].date) {
                [this.appointments[j + 1], this.appointments[j]] = [
                  this.appointments[j],
                  this.appointments[j + 1],
                ];
              } else if (
                this.appointments[j + 1].date === this.appointments[j].date
              ) {
                if (
                  this.appointments[j + 1].startTime <
                  this.appointments[j].startTime
                )
                  [this.appointments[j + 1], this.appointments[j]] = [
                    this.appointments[j],
                    this.appointments[j + 1],
                  ];
              }
            }
          }

          for (let index = 0; index < this.appointments.length; ++index) {
            //format date, start time, and end time
            let element = this.appointments[index];
            this.appointments[index].date = element.date.substring(0, 10);
            this.appointments[index].startTime = this.formatTimeFromString(
              element.startTime
            );
            this.appointments[index].endTime = this.formatTimeFromString(
              element.endTime
            );
          }

          var date = new Date();
          this.today =
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0") +
            "-" +
            date.getFullYear();
          this.fileName = this.user.selectedGroup + " Report for " + this.today;
          await this.setSelectedAppointments();
          this.updatePeople();
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = "Error in data";
          this.showAlert = true;
          console.log("There was an error:", error);
        });
    },
    async getTopicsForGroup() {
      await TopicServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.topics = response.data;
          this.topics.push({ name: "Any", id: -1 });
          this.status.push({ name: "Any", title: "Any", id: -1 });
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    //Update the lists of tutors and students
    async updatePeople() {
      this.tutors = [];
      this.students = [];
      await PersonServices.getAllForGroup(this.group.id)
        .then((response) => {
          let people = response.data;
          for (let i = 0; i < people.length; i++) {
            people[i].fullName = people[i].fName + " " + people[i].lName;
            // makes sure to add people to both arrays if they have both roles
            for (let j = 0; j < people[i].personrole.length; j++) {
              if (people[i].personrole[j].role.type.includes("Tutor")) {
                this.tutors.push(people[i]);
              } else if (
                people[i].personrole[j].role.type.includes("Student")
              ) {
                this.students.push(people[i]);
              }
            }
          }
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    filter() {
      // filter appointments by date
      console.log(this.selectedAppointments[0].date);

      console.log(this.dates[0]);
      console.log(this.dates[1]);

      if (this.dates.length > 0) {
        this.selectedAppointments = this.selectedAppointments.filter(
          (appointment) =>
            appointment.date >= this.dates[0] &&
            appointment.date <= this.dates[1]
        );
      }
      // filter by topic
      if (this.selectedTopic > 0) {
        this.selectedAppointments = this.selectedAppointments.filter(
          (appointment) => appointment.topicId === this.selectedTopic
        );
      }
      // filter by status, >= 0 since the array starts at 0
      if (this.selectedStatus >= 0) {
        console.log(this.status[this.selectedStatus].name.toLowerCase());
        this.selectedAppointments = this.selectedAppointments.filter(
          (appointment) =>
            this.status[this.selectedStatus].name
              .toLowerCase()
              .includes(appointment.status.toLowerCase())
        );
      }
      // filter by tutors
      if (this.selectedTutors.length > 0) {
        let tempTutors = this.selectedTutors;
        let tempAppoints = [];
        for (let k = 0; k < this.selectedAppointments.length; k++) {
          let appoint = this.selectedAppointments[k];
          for (let i = 0; i < appoint.tutors.length; i++) {
            for (let j = 0; j < tempTutors.length; j++) {
              if (appoint.tutors[i].name === tempTutors[j])
                tempAppoints.push(appoint);
            }
          }
        }
        this.selectedAppointments = tempAppoints;
      }
      // filter by students
      if (this.selectedStudents.length > 0) {
        let tempStudents = this.selectedStudents;
        let tempAppoints = [];
        for (let k = 0; k < this.selectedAppointments.length; k++) {
          let appoint = this.selectedAppointments[k];
          for (let i = 0; i < appoint.students.length; i++) {
            for (let j = 0; j < tempStudents.length; j++) {
              if (appoint.students[i].name === tempStudents[j])
                tempAppoints.push(appoint);
            }
          }
        }
        this.selectedAppointments = tempAppoints;
      }
      // makes sure we're not trying to create an empty csv file
      if (this.selectedAppointments.length === 0) {
        this.showAlert = true;
        this.alertType = "warning";
        this.alert = "There are no appointments that meet this criteria.";
        // reset variables
        this.dates = [];
        this.selectedTopic = -1;
        this.selectedStatus = -1;
        this.selectedStudents = [];
        this.selectedTutors = [];
        this.getAllAppointmentsForGroup();
      } else {
        this.isFiltered = true;
        this.showAlert = false;
      }
    },
  },
};
</script>

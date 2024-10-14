<template>
  <div>
    <v-container>
      <v-card-title
        class="text-h4 font-weight-bold pt-4 pb-6 pl-0 pr-0 accent--text"
      >
        <span v-if="$refs.calendar"
          >{{ user.selectedGroup }} - {{ $refs.calendar.title }}</span
        >
        <span v-else> {{ user.selectedGroup }}'s Calendar </span>
        <InformationComponent
          message="Select an appointment to view information, book the appointment,
            make changes, etc.
            You can filter the appointments by a desired Topic or Tutor."
        ></InformationComponent
        ><v-spacer></v-spacer>
        <v-card-title class="text-right pt-0 pb-0 pl-0 pr-0 accent--text">{{
          role.type
        }}</v-card-title>
      </v-card-title>
      <v-alert v-model="showAlert" dismissible :type="alertType">{{
        alert
      }}</v-alert>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>

          <v-btn
            outlined
            class="ma-2"
            color="grey darken-2"
            right
            @click="keyVisible = true"
          >
            Key
          </v-btn>

          <v-btn
            outlined
            class="ma-2"
            color="grey darken-2"
            @click="
              focus = '';
              type = 'month';
            "
          >
            Today
          </v-btn>

          <v-menu bottom right>
            <template #activator="{ on, attrs }">
              <v-btn
                class="ma-2"
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-select
            v-model="selectedTopic"
            :items="topics"
            item-text="name"
            item-value="id"
            label="Topic"
            hide-details
            class="ma-2"
            dense
            outlined
            @change="getAppointments()"
          ></v-select>
          <v-select
            v-model="selectedLocation"
            :items="locations"
            item-text="name"
            item-value="id"
            label="Location"
            hide-details
            class="ma-2"
            dense
            outlined
            @change="getAppointments()"
          ></v-select>
          <v-select
            v-model="selectedTutor"
            :items="tutorSelect"
            item-text="name"
            item-value="id"
            label="Tutor"
            hide-details
            class="ma-2"
            dense
            outlined
            @change="getAppointments()"
          ></v-select>

          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="700">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-overlap-mode="mode"
          :event-overlap-threshold="15"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
        ></v-calendar>

        <v-dialog v-model="appointmentDialog" persistent max-width="800px">
          <AppointmentDialogBody
            :sent-appointment="selectedAppointment"
            @closeAppointmentDialog="appointmentDialog = false"
            @doneWithAppointment="initialize()"
          ></AppointmentDialogBody>
        </v-dialog>
        <!-- <v-menu
          v-model="appointmentDialog"
          :open-on-click="false"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <AppointmentDialogBody
            :sent-appointment="selectedAppointment"
            @closeAppointmentDialog="appointmentDialog = false"
            @doneWithAppointment="
              appointmentDialog = false;
              initializeData();
            "
          ></AppointmentDialogBody>
        </v-menu> -->
      </v-sheet>
      <v-dialog v-model="keyVisible" max-width="600px">
        <v-card>
          <v-card-title class="primary white--text mb-2"
            >Calendar Key
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Color</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Private</th>
                  <th class="text-left">Group</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="info in keys" :key="info.color">
                  <td>
                    <v-icon :color="info.color">mdi-circle</v-icon>
                  </td>
                  <td class="text-body-2">{{ info.text }}</td>
                  <td>
                    <v-icon v-if="info.private" color="black"
                      >mdi-check-bold</v-icon
                    >
                  </td>
                  <td>
                    <v-icon v-if="info.group" color="black"
                      >mdi-check-bold</v-icon
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey white--text" @click="keyVisible = false"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64">
          Loading...
        </v-progress-circular>
      </v-overlay>
    </v-container>
  </div>
</template>

<script>
//For info on people and their associated roles
import PersonServices from "@/services/personServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import PersonRolePrivilegeServices from "@/services/personRolePrivilegeServices.js";
//For info to be shown with appointments
import TopicServices from "@/services/topicServices.js";
import LocationServices from "@/services/locationServices.js";
//Plugin functions
import Utils from "@/config/utils.js";
import AppointmentDialogBody from "../components/AppointmentDialogBody.vue";
import InformationComponent from "../components/InformationComponent.vue";
import { CalendarMixin } from "../mixins/CalendarMixin";
import { TimeFunctionsMixin } from "../mixins/TimeFunctionsMixin";

export default {
  name: "Calendar",
  components: {
    AppointmentDialogBody,
    InformationComponent,
  },
  mixins: [CalendarMixin, TimeFunctionsMixin],
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data: () => ({
    showAlert: false,
    alert: "",
    alertType: "success",
    overlay: true,
    mode: "stack",
    appointments: [],
    selectedAppointment: {},
    events: [],
    user: {},
    role: {},
    group: {},
    personRolePrivileges: [],
    topics: [],
    locations: [],
    tutorSelect: [],
    selectedTopic: -1,
    selectedTutor: -1,
    selectedLocation: -1,
    keyVisible: false,
    appointmentDialog: false,
    selectedElement: null,
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    keys: [
      {
        color: "grey",
        text: "Available",
        private: true,
        group: false,
      },
      {
        color: "yellow",
        text: "Pending",
        private: true,
        group: false,
      },
      {
        color: "error",
        text: "Canceled/No Show",
        private: true,
        group: true,
      },
      { color: "teal", text: "Available", private: false, group: true },
      { color: "blue", text: "Booked", private: true, group: true },
      {
        color: "darkblue",
        text: "Completed",
        private: true,
        group: true,
      },
    ],
  }),
  async created() {
    this.user = Utils.getStore("user");
    this.role = this.user.selectedRole;
    await this.getPrivilegesForPersonRole();
    await this.getGroupByPersonRoleId();
    await this.getTopicsForGroup();
    await this.getTutorsForGroup();
    await this.getLocationsForGroup();
    await this.initialize();
  },
  methods: {
    async initialize() {
      this.appointmentDialog = false;
      this.overlay = true;
      await this.getAppointments();
      this.overlay = false;
    },
    async getPrivilegesForPersonRole() {
      await PersonRolePrivilegeServices.getPrivilegeByPersonRole(this.id)
        .then((response) => {
          this.personRolePrivileges = response.data;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
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
    async getTopicsForGroup() {
      await TopicServices.getActiveForGroup(this.group.id)
        .then((response) => {
          let temp = response.data;
          this.topics.push({ name: "All", id: -1 });
          for (let i = 0; i < temp.length; i++) {
            this.topics.push(temp[i]);
          }
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },

    async getLocationsForGroup() {
      await LocationServices.getAllForGroup(this.group.id)
        .then((response) => {
          let temp = response.data;
          this.locations.push({ name: "All", id: -1 });
          for (let i = 0; i < temp.length; i++) {
            this.locations.push(temp[i]);
          }
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    async getTutorsForGroup() {
      await PersonServices.getApprovedTutorsForGroup(this.group.id)
        .then((response) => {
          let temp = response.data;
          this.tutorSelect.push({ name: "All", id: -1 });
          for (var i = 0; i < temp.length; i++) {
            temp[i].name = temp[i].fName + " " + temp[i].lName;
            this.tutorSelect.push(temp[i]);
          }
          this.tutorSelect.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    hasRole(type) {
      return (
        this.user.selectedRole.type !== null &&
        this.user.selectedRole.type === type
      );
    },
    checkTopic(appointment) {
      let check = false;
      if (this.selectedTopic === null) return true;
      if (this.selectedTopic === appointment.topicId) return true;
      if (
        appointment.topicId !== null &&
        this.selectedTopic !== appointment.topicId
      )
        return false;
      for (let i = 0; i < appointment.tutors.length && !check; i++) {
        let tutor = appointment.tutors[i];
        for (let j = 0; j < tutor.person.persontopic.length && !check; j++) {
          let tutorTopic = tutor.person.persontopic[j];
          if (tutorTopic.topicId === this.selectedTopic) {
            check = true;
          }
        }
      }
      return check;
    },
    checkLocation(appointment) {
      let check = false;
      if (this.selectedLocation === null) return true;
      if (this.selectedLocation === appointment.locationId) return true;
      if (appointment.locationId == null) return true;

      return check;
    },
    checkTutor(appointment) {
      return (
        appointment.personappointment.find(
          (p) => p.personId === this.selectedTutor && p.isTutor
        ) !== undefined
      );
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "week";
    },
    getEventColor(event) {
      return event.color;
    },
    //Animates Event card popping up
    async showEvent({ nativeEvent, event }) {
      const open = async () => {
        this.selectedAppointment = event.appointment;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.appointmentDialog = true))
        );
      };
      if (this.appointmentDialog) {
        this.appointmentDialog = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    async getAppointments() {
      this.appointments = await this.getAppointmentsForGroup(this.group.id);
      let today = new Date();
      today.setHours(today.getHours() - today.getTimezoneOffset() / 60);
      today.setHours(0, 0, 0, 0);
      const events = [];
      let filtered;
      for (let i = 0; i < this.appointments.length; i++) {
        let appointment = this.appointments[i];
        appointment.group = this.group;
        this.setIsDatePast(appointment);

        appointment.isMemberOfAppointment = appointment.personappointment.find(
          (person) => {
            return person.personId === this.user.userID;
          }
        );
        appointment.isStudent = appointment.students.find((student) => {
          return student.personId === this.user.userID;
        });
        appointment.isTutor = appointment.tutors.find((tutor) => {
          return tutor.personId === this.user.userID;
        });

        //filter events to only add appropriate events
        filtered = true;
        //only add appointments from the current group
        if (appointment.groupId != this.group.id) {
          filtered = false;
        }
        //filter by topic
        if (this.selectedTopic != -1 && !this.checkTopic(appointment)) {
          filtered = false;
        }
        //filter by Location
        if (this.selectedLocation != -1 && !this.checkLocation(appointment)) {
          filtered = false;
        }
        //filter by tutor
        if (this.selectedTutor != -1 && !this.checkTutor(appointment)) {
          filtered = false;
        }
        //filter all available appointments, their appointments, and all group appointments for STUDENTS
        if (this.hasRole("Student")) {
          //filter away private appointments that aren't a student's
          if (
            appointment.type === "Private" &&
            !appointment.isStudent &&
            !(appointment.status === "available")
          ) {
            filtered = false;
          }
          //filter away group appointments that have passed that aren't a student's
          else if (
            appointment.type === "Group" &&
            !appointment.isStudent &&
            appointment.isDatePast
          ) {
            filtered = false;
          }
          //filter away canceled appointments
          else if (appointment.status.includes("Cancel")) {
            filtered = false;
          }
        }
        //filter their appointments, all available appointments, all group appointments, and their canceled appointments for TUTORS
        else if (this.hasRole("Tutor")) {
          //filter away canceled appointments that aren't theirs
          if (!appointment.isTutor && appointment.status.includes("Cancel")) {
            filtered = false;
          }
        }
        if (filtered) {
          this.setUpCalendarEvent(appointment);
          appointment.personRolePrivileges = this.personRolePrivileges;
          let event = {
            name: appointment.name,
            start: appointment.eventStart,
            end: appointment.eventEnd,
            color: appointment.color,
            timed: true,
            appointment: appointment,
          };

          events.push(event);
        }
      }

      this.events = events;
    },
  },
};
</script>

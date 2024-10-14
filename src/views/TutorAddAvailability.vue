<template>
  <div>
    <v-container>
      <v-card-title
        class="text-h4 font-weight-bold pt-4 pb-6 pl-0 pr-0 accent--text"
        >Add Availabilities for {{ group.name }}
        <InformationComponent
          :message="
            'Add the times you will be available to tutor students for ' +
            group.name +
            '.'
          "
        ></InformationComponent>
      </v-card-title>
      <div v-if="!group.allowSplittingAppointments">
        <b
          >Please create availabilities with specific appointments times, not
          big blocks of time.</b
        >
        <br />
        <br />
      </div>
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
      <v-dialog v-model="doubleBookedDialog" max-width="600px">
        <v-card min-width="350px">
          <v-card-title class="error white--text mb-2">
            Cannot Add Conflicting Availability
          </v-card-title>
          <v-card-subtitle class="error white--text pb-2 mb-2">
            You already have an appointment during this time.
          </v-card-subtitle>
          <v-card-text>
            <v-card
              v-for="conflictDate in conflictingDates"
              :key="conflictDate.date"
              class="mb-2"
            >
              <v-card-title class="pb-0">
                {{
                  `${conflictDate.date}, ${conflictDate.conflictingAvailability.time}`
                }}
              </v-card-title>
              <v-list dense nav>
                <v-list-item
                  v-for="existing in conflictDate.existingAvailabilities"
                  :key="existing.time"
                  class="grey lighten-2"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ existing.name }} </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ `${conflictDate.date}, ${existing.time}` }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
            <div class="mt-4">
              If you selected multiple dates, appointments that don't conflict
              have already been made.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey white--text" @click="doubleBookedDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="accent white--text mb-2"
              >Select Dates for Tutoring
              <v-spacer></v-spacer>
              <InformationComponent
                :message="'Click dates here.'"
              ></InformationComponent>
            </v-card-title>
            <v-date-picker
              v-model="dates"
              :min="nowDate"
              :events="upcoming"
              show-current
              no-title
              reactive
              full-width
              show-adjacent-months
              multiple
              @input="
                updateTimes();
                updateDisplayedDates();
              "
            ></v-date-picker>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="0">
            <v-combobox
              v-model="displayedDates"
              multiple
              chips
              label="Selected Dates"
              prepend-icon="mdi-calendar"
              clearable
              readonly
              @click:clear="
                dates = [];
                displayedDates = [];
              "
            ></v-combobox>
            <v-row>
              <v-col>
                <v-select
                  v-model="displayedStart"
                  :items="startTimes"
                  label="Start Time"
                  item-text="timeText"
                  item-value="time"
                  menu-props="auto"
                  prepend-icon="mdi-clock-edit-outline"
                  @change="
                    newStart = displayedStart;
                    updateTimes();
                    secondTime = false;
                  "
                >
                </v-select>
              </v-col>
              <v-col>
                <v-select
                  v-model="displayedEnd"
                  :items="endTimes"
                  label="End Time"
                  item-text="timeText"
                  item-value="time"
                  prepend-icon="mdi-clock-edit-outline"
                  :disabled="secondTime"
                  @change="
                    newEnd = displayedEnd;
                    updateTimes();
                  "
                >
                </v-select>
              </v-col>
            </v-row>
            <v-select
              v-model="type"
              :items="appointmentTypes"
              label="Appointment Type"
              prepend-icon="mdi-account-multiple-outline"
            >
            </v-select>

            <v-select
              v-model="location"
              :items="locations"
              item-text="name"
              item-value="id"
              label="Location"
              prepend-icon="mdi-map-marker-outline"
            >
            </v-select>
            <div v-if="type === 'Group'">
              <v-select
                v-model="topic"
                :items="topics"
                item-text="name"
                item-value="id"
                label="Topic"
                prepend-icon="mdi-book-edit-outline"
              >
              </v-select>

              <v-textarea
                v-model="preSessionInfo"
                :counter="500"
                label="What will you be helping with?"
                prepend-icon="mdi-text-box-edit-outline"
                auto-grow
                rows="2"
              ></v-textarea>
            </div>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                :disabled="
                  displayedEnd === '' ||
                  displayedEnd === null ||
                  displayedEnd === undefined ||
                  displayedStart === '' ||
                  displayedStart === null ||
                  displayedStart === undefined ||
                  type === '' ||
                  type === null ||
                  type === undefined ||
                  dates.length === 0 ||
                  (type === 'Group' &&
                    (location === '' ||
                      location === null ||
                      location === undefined ||
                      topic === '' ||
                      topic === null ||
                      topic === undefined))
                "
                @click="addAvailability()"
              >
                Add Availability
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <br />
      <v-card>
        <v-card-title>
          Your Availabilities for All Groups
          <v-checkbox
            class="ml-4"
            v-model="viewAllAvailabilities"
            label="Include Past Availabilities"
            @change="getAvailabilities()"
          ></v-checkbox>
          <v-spacer></v-spacer>

          <InformationComponent
            message="If you want to remove an availability, go to the Calendar page and cancel the appointment there."
          ></InformationComponent>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="availabilities"
          :items-per-page="50"
        >
        </v-data-table>
      </v-card>

      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64">
          Loading...
        </v-progress-circular>
      </v-overlay>
    </v-container>
  </div>
</template>

<script>
import AvailabilityServices from "@/services/availabilityServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import PersonRolePrivilegeServices from "@/services/personRolePrivilegeServices.js";
import TopicServices from "@/services/topicServices.js";
import LocationServices from "@/services/locationServices.js";
import AppointmentServices from "@/services/appointmentServices.js";
import PersonAppointmentServices from "@/services/personAppointmentServices.js";
import InformationComponent from "../components/InformationComponent.vue";
import Utils from "@/config/utils.js";
import { CalendarMixin } from "../mixins/CalendarMixin";
import { TimeFunctionsMixin } from "../mixins/TimeFunctionsMixin";

export default {
  name: "TutorAddAvailability",
  components: {
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
    viewAllAvailabilities: false,
    showAlert: false,
    alert: "",
    alertType: "success",
    nowDate: null,
    nowTime: null,
    type: "",
    conflictingDates: [],
    conflictingAvailabilities: [],
    availabilitiesToSave: [],
    availabilities: [],
    upcoming: [],
    dates: [],
    appointmentTypes: ["Private", "Group"],
    displayedDates: [],
    overlay: false,
    doubleBookedDialog: false,
    secondTime: true,
    startTimes: [],
    endTimes: [],
    displayedStart: "",
    displayedEnd: "",
    newStart: "00:00",
    newEnd: "",
    startTime: null,
    endTime: null,
    user: {},
    group: {},
    topic: "",
    topics: [],
    location: null,
    locations: [],
    personRolePrivileges: [],
    preSessionInfo: "",
    headers: [
      { text: "Date", value: "date" },
      { text: "Start Time", value: "startTime" },
      { text: "End Time", value: "endTime" },
    ],
  }),
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupByPersonRoleId();
    // below generates the latest time a day can have an appointment based on the group's time interval
    this.newEnd = "23:" + (59 - (this.group.timeInterval - 1)).toString();
    await this.getAvailabilities();
    this.updateTimes();
    await this.getUpcoming();
    await this.getPrivilegesForPersonRole();
  },
  methods: {
    showInterval() {
      return false;
    },
    updateDisplayedDates() {
      this.displayedDates = [];
      for (let i = 0; i < this.dates.length; i++) {
        let tempDate = new Date(this.dates[i]);
        tempDate.setHours(
          tempDate.getHours() + tempDate.getTimezoneOffset() / 60
        );
        this.displayedDates.push(this.formatReadableDate(tempDate));
      }
    },
    updateTimes() {
      let maxEndTime = "23:" + (59 - (this.group.timeInterval - 1)).toString();
      // setting the minimum date and time for the picker components
      this.nowDate = this.getLocalDateString();
      let temp = this.roundToNearestInterval(
        new Date(),
        this.group.timeInterval
      );
      // see if selected dates includes today -- if not, allow all times
      const test = this.dates.filter((date) => date === this.nowDate);
      if (test.length > 0) {
        this.nowTime = temp.toString().slice(16, 21);
      } else {
        this.nowTime = "00:00";
      }
      // start times will always be in segments of group time interval
      this.startTimes = this.generateTimeSlots(
        this.nowTime,
        this.newEnd,
        this.group.timeInterval
      );
      // adding this to make sure that you can't start an appointment at the end time
      this.startTimes.pop();
      // end times will usually be in group's min appointment time, but could also be time interval if tutor has the right privilege

      // set default displayed start
      if (this.displayedStart === "") {
        this.displayedStart = this.startTimes.find(
          (time) => time.time === "08:00:00"
        ).time;
        this.newStart = this.displayedStart;
        this.secondTime = false;
      }

      if (
        this.checkPrivilege(
          "Make flexible slots that allow for shorter appointments"
        )
      ) {
        this.endTimes = this.generateTimeSlots(
          this.newStart,
          maxEndTime,
          this.group.timeInterval
        );
      } else {
        this.endTimes = this.generateTimeSlots(
          this.newStart,
          maxEndTime,
          this.group.minApptTime
        );
      }

      // adding this to make sure you can't end an appointment at the start time
      this.endTimes.shift();
    },
    checkIfAvailable(tempAvailability) {
      let isAvailable = true;
      this.conflictingDates.push({
        date: this.formatReadableDate(tempAvailability.date),
        testDate: tempAvailability.date,
        existingAvailabilities: [],
        conflictingAvailability: {},
      });
      for (let i = 0; i < this.upcoming.length; i++) {
        let appointment = this.upcoming[i];
        appointment.startTime = appointment.startTime.substring(0, 8);
        appointment.endTime = appointment.endTime.substring(0, 8);
        if (
          tempAvailability.date === appointment.date &&
          this.isOverlapping(tempAvailability, appointment)
        ) {
          this.setUpCalendarEvent(appointment);
          isAvailable = false;
          this.conflictingDates
            .find(
              (conflictDate) => conflictDate.testDate === tempAvailability.date
            )
            .existingAvailabilities.push({
              name: appointment.name,
              time:
                this.formatTimeFromString(appointment.startTime) +
                " - " +
                this.formatTimeFromString(appointment.endTime),
            });
        }
      }
      if (isAvailable) {
        this.conflictingDates.pop();
        this.availabilitiesToSave.push(tempAvailability);
      } else {
        this.conflictingDates.find(
          (conflictDate) => conflictDate.testDate === tempAvailability.date
        ).conflictingAvailability = {
          time:
            this.formatTimeFromString(tempAvailability.startTime) +
            " - " +
            this.formatTimeFromString(tempAvailability.endTime),
        };
      }
    },
    async addAvailability() {
      this.overlay = true;
      if (
        this.group.id === null ||
        this.group.id === undefined ||
        this.group.id === ""
      ) {
        await this.getGroupByPersonRoleId().catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
      }
      this.conflictingDates = [];

      for (var i = 0; i < this.dates.length; i++) {
        let date = new Date(this.dates[i]);
        date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
        let availability = {
          date: date.toISOString(),
          startTime: this.newStart,
          endTime: this.newEnd,
          personId: this.user.userID,
        };

        this.checkIfAvailable(availability);
      }

      if (this.conflictingDates.length > 0) {
        this.doubleBookedDialog = true;
      }

      for (let i = 0; i < this.availabilitiesToSave.length; i++) {
        let availability = this.availabilitiesToSave[i];
        let appointment = {
          date: availability.date,
          startTime: this.newStart,
          endTime: this.newEnd,
          type: this.type,
          locationId: this.location,
          topicId: this.type === "Private" ? null : this.topic,
          preSessionInfo: this.type === "Private" ? null : this.preSessionInfo,
          groupId: this.group.id,
          status: "available",
        };

        await AvailabilityServices.addAvailability(availability).catch(
          (error) => {
            this.alertType = "error";
            this.alert = error.response.data.message;
            this.showAlert = true;
            console.log("There was an error:", error.response);
          }
        );

        await AppointmentServices.addAppointment(appointment)
          .then(async (response) => {
            appointment.id = response.data.id;
          })
          .catch((error) => {
            this.alertType = "error";
            this.alert = error.response.data.message;
            this.showAlert = true;
            console.log("There was an error:", error.response);
          });

        let personAppointment = {
          personId: this.user.userID,
          appointmentId: appointment.id,
          isTutor: true,
        };

        await PersonAppointmentServices.addPersonAppointment(
          personAppointment
        ).catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });

        if (appointment.type === "Group") {
          // this adds the appointment to google
          await AppointmentServices.updateAppointment(
            appointment.id,
            appointment
          ).catch((error) => {
            this.alertType = "error";
            this.alert = error.response.data.message;
            this.showAlert = true;
            console.log("There was an error:", error.response);
          });
        }
      }

      this.availabilitiesToSave = [];
      this.dates = [];
      this.displayedDates = [];
      this.displayedStart = "";
      this.displayedEnd = "";
      this.newStart = "00:00";
      this.newEnd = "23:" + (59 - (this.group.timeInterval - 1)).toString();
      this.type = "";
      this.topic = "";
      this.location = "";
      this.preSessionInfo = "";
      this.secondTime = true;
      await this.getAvailabilities();
      this.updateTimes();
      this.overlay = false;

      if (this.availabilitiesToSave.length > 0) {
        this.alertType = "success";
        this.alert = "You have successfully added availabilities.";
        this.showAlert = true;
      }
    },
    async getUpcoming() {
      await AppointmentServices.getUpcomingForPerson(this.user.userID)
        .then((response) => {
          this.upcoming = response.data;
          for (let i = 0; i < this.upcoming.length; i++) {
            let appointment = this.upcoming[i];
            if (
              appointment.personappointment !== null &&
              appointment.personappointment !== undefined
            ) {
              appointment.students = appointment.personappointment.filter(
                (pa) => pa.isTutor === false
              );
              appointment.tutors = appointment.personappointment.filter(
                (pa) => pa.isTutor === true
              );
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
    async getAvailabilities() {
      if (!this.viewAllAvailabilities) {
        await AvailabilityServices.getUpcomingForPerson(this.user.userID)
          .then((response) => {
            this.availabilities = response.data;

            for (let index = 0; index < this.availabilities.length; ++index) {
              //format date, start time, and end time
              let element = this.availabilities[index];
              this.availabilities[index].date = this.formatReadableDate(
                element.date
              );
              this.availabilities[index].startTime = this.formatTimeFromString(
                element.startTime
              );
              this.availabilities[index].endTime = this.formatTimeFromString(
                element.endTime
              );
            }
          })
          .catch((error) => {
            this.alertType = "error";
            this.alert = error.response.data.message;
            this.showAlert = true;
            console.log("`There was an error:", error.response);
          });
      } else {
        await AvailabilityServices.getPersonAvailability(this.user.userID)
          .then((response) => {
            this.availabilities = response.data;

            for (let index = 0; index < this.availabilities.length; ++index) {
              //format date, start time, and end time
              let element = this.availabilities[index];
              this.availabilities[index].date = this.formatReadableDate(
                element.date
              );
              this.availabilities[index].startTime = this.formatTimeFromString(
                element.startTime
              );
              this.availabilities[index].endTime = this.formatTimeFromString(
                element.endTime
              );
            }
          })
          .catch((error) => {
            this.alertType = "error";
            this.alert = error.response.data.message;
            this.showAlert = true;
            console.log("`There was an error:", error.response);
          });
      }
    },
    async getGroupByPersonRoleId() {
      await PersonRoleServices.getGroupForPersonRole(this.id)
        .then(async (response) => {
          this.group = response.data[0].role.group;
          await this.getTopicsForGroup();
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    async getTopicsForGroup() {
      await TopicServices.getTopicByGroupForPerson(
        this.group.id,
        this.user.userID
      )
        .then(async (response) => {
          this.topics = response.data;
          await LocationServices.getActiveForGroup(this.group.id).then(
            (response) => {
              this.locations = response.data;
            }
          );
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
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
    checkPrivilege(privilege) {
      let hasPriv = false;
      this.personRolePrivileges.forEach((priv) => {
        if (priv.privilege === privilege) hasPriv = true;
      });
      return hasPriv;
    },
  },
};
</script>

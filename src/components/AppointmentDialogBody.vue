<template>
  <v-card min-width="350px">
    <v-card-title :class="appointment.color + ' white--text mb-2 headline'"
      >{{ appointment.name }}
    </v-card-title>
    <v-card-subtitle :class="appointment.color + ' white--text pb-2 mb-2'">
      {{ formatReadableDate(appointment.date) }} •
      {{ formatTimeFromString(appointment.startTime) }} -
      {{ formatTimeFromString(appointment.endTime) }}
    </v-card-subtitle>
    <v-card-text v-if="!showFeedbackDialog">
      <v-row>
        <v-col>
          <div class="mt-2">
            <v-icon class="mr-2">mdi-human-male-board-poll</v-icon>
            <b>Tutors: </b>
            {{ tutorString }}
          </div>
        </v-col>
        <v-col>
          <div class="mt-2">
            <v-icon class="mr-2">mdi-account-multiple-outline</v-icon>
            <b>Students: </b>
            {{ studentString }}
          </div>
        </v-col>
      </v-row>

      <div v-if="isAdminAddStudent">
        <v-text-field
          v-model="addedStudent.email"
          label="Student's Email"
          prepend-icon="mdi-at"
          :suffix="emailStatus"
          autofocus
          required
          :rules="[rules.required, rules.email]"
          @keyup.enter="findEmail()"
          @change="allowAdminAddStudent = false"
        >
        </v-text-field>
      </div>
      <v-row v-if="validateEmail() && allowAdminAddStudent">
        <v-col>
          <v-text-field
            v-model="addedStudent.fName"
            label="Student's First Name"
            prepend-icon="mdi-account-circle-outline"
            :readonly="!needStudentInfo"
            :autofocus="needStudentInfo"
            @change="checkButtons()"
          >
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="addedStudent.lName"
            label="Student's Last Name"
            :readonly="!needStudentInfo"
            @change="checkButtons()"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <div
        v-if="
          appointment.location !== null &&
          appointment.location.type === 'Online' &&
          appointment.URL !== null &&
          !appointment.isDatePast
        "
        class="mt-2 mb-2"
      >
        <v-icon class="mr-2">mdi-link-variant</v-icon>
        <b>Google Meet Link: </b>
        <a :href="appointment.URL">{{ appointment.URL }}</a>
      </div>

      <v-select
        v-if="isAdminAddStudent && checkAppointmentType('Private')"
        v-model="newStatus"
        :items="statuses"
        label="Status"
        @change="checkButtons()"
      >
        <template #prepend>
          <v-icon
            :color="
              newStatus === 'Booked'
                ? 'blue'
                : newStatus === 'Pending'
                ? 'yellow'
                : 'grey'
            "
            >{{
              newStatus === "Booked"
                ? "mdi-radiobox-marked"
                : newStatus === "Pending"
                ? "mdi-radiobox-marked"
                : "mdi-radiobox-blank"
            }}</v-icon
          >
        </template>
      </v-select>

      <v-select
        v-model="appointment.locationId"
        :items="locations"
        item-text="name"
        item-value="id"
        label="Location"
        :prepend-icon="
          canEditLocation
            ? 'mdi-map-marker-outline'
            : 'mdi-map-marker-check-outline'
        "
        :readonly="!canEditLocation"
        :disabled="appointment.isDatePast"
        @change="checkButtons()"
      >
      </v-select>

      <v-select
        v-model="appointment.topicId"
        :items="currentTopics"
        item-text="name"
        item-value="id"
        label="Topic"
        :prepend-icon="
          canEditTopic ? 'mdi-book-edit-outline' : 'mdi-book-outline'
        "
        :readonly="!canEditTopic"
        :disabled="appointment.isDatePast"
        @change="checkButtons()"
      >
      </v-select>

      <v-row>
        <v-col>
          <v-select
            v-model="appointment.displayedStart"
            :items="startTimes"
            item-text="timeText"
            item-value="time"
            label="Start Time"
            :prepend-icon="
              canEditFirstTime ? 'mdi-clock-edit-outline' : 'mdi-clock-outline'
            "
            :readonly="!canEditFirstTime"
            :disabled="appointment.isDatePast"
            @change="
              appointment.newStart = appointment.displayedStart;
              updateTimes();
              canEditSecondTime = true;
              checkButtons();
            "
          >
          </v-select>
        </v-col>
        <v-col>
          <v-select
            v-model="appointment.displayedEnd"
            :items="endTimes"
            item-text="timeText"
            item-value="time"
            label="End Time"
            :prepend-icon="
              canEditFirstTime && canEditSecondTime
                ? 'mdi-clock-edit-outline'
                : 'mdi-clock-outline'
            "
            :readonly="!canEditFirstTime || !canEditSecondTime"
            :disabled="appointment.isDatePast"
            @change="
              appointment.newEnd = appointment.displayedEnd;
              updateTimes();
              checkButtons();
            "
          >
          </v-select>
        </v-col>
      </v-row>

      <v-textarea
        v-model="appointment.preSessionInfo"
        :counter="500"
        :label="
          appointment.type === 'Private'
            ? 'What do you need help with?'
            : 'What this appointment hopes to provide:'
        "
        :prepend-icon="
          canEditPreSession ? 'mdi-comment-edit-outline' : 'mdi-comment-outline'
        "
        auto-grow
        rows="2"
        :readonly="!canEditPreSession"
        :disabled="appointment.isDatePast"
        @change="checkButtons()"
      ></v-textarea>
    </v-card-text>

    <v-card-text v-else>
      <div class="text-h6">
        What would you rate this appointment experience?
      </div>

      <v-rating
        v-model="updatedPersonAppointment.feedbacknumber"
        class="justify-center"
        background-color="grey"
        color="primary"
        empty-icon="mdi-star-outline"
        half-icon="mdi-star-half-full"
        full-icon="mdi-star"
        hover
        half-increments
        :readonly="isNoShow || isNoAccept"
        label="Rating"
        length="5"
        x-large
      ></v-rating>

      <v-textarea
        v-model="updatedPersonAppointment.feedbacktext"
        :counter="500"
        label="How did your session go?"
        :prepend-icon="
          isNoShow || isNoAccept
            ? 'mdi-text-box-outline'
            : 'mdi-text-box-edit-outline'
        "
        auto-grow
        rows="2"
        :readonly="isNoShow || isNoAccept"
      ></v-textarea>

      <v-checkbox
        v-if="hasRole('Tutor') && appointment.status != 'pending'"
        v-model="isNoShow"
        dense
        label="Did you experience a no-show?"
        @change="updateFeedbackText()"
      ></v-checkbox>
      <v-checkbox
        v-if="hasRole('Tutor') && appointment.status == 'pending'"
        v-model="isNoAccept"
        dense
        label="Did not Accept and not meet the student?"
        @change="updateFeedbackText()"
      ></v-checkbox>
    </v-card-text>

    <v-card-actions v-if="!showFeedbackDialog">
      <v-spacer></v-spacer>

      <v-btn
        v-if="showEnableCancelButton"
        color="error white--text"
        @click="showDeleteConfirmation = true"
      >
        Cancel Appointment
      </v-btn>

      <v-btn
        v-if="showEnableConfirmRejectButtons"
        color="error white--text"
        @click="showDeleteConfirmation = true"
      >
        Reject Appointment
      </v-btn>

      <v-btn
        v-if="isAdminAddStudent && !allowAdminAddStudent"
        color="darkblue white--text"
        :disabled="!validateEmail()"
        @click="findEmail()"
      >
        Search Student
      </v-btn>

      <v-btn
        v-if="showEnableSignUpButton && !isAdminAddStudent"
        color="darkblue white--text"
        @click="isAdminAddStudent = true"
      >
        Sign Up Student
      </v-btn>

      <v-btn color="grey white--text" @click="$emit('closeAppointmentDialog')">
        {{ saveChanges && !isAdminAddStudent ? "Discard Changes" : "Close" }}
      </v-btn>

      <v-btn
        v-if="showSaveButton"
        color="accent"
        :disabled="!saveChanges"
        @click="
          editAppointment(user, appointment);
          $emit('doneWithAppointment');
        "
      >
        Save Changes
      </v-btn>

      <v-btn
        v-if="showEnableConfirmRejectButtons"
        color="accent"
        @click="sendAppointmentForConfirmation()"
      >
        Confirm Appointment
      </v-btn>

      <v-btn
        v-if="showBookButton"
        color="accent"
        :disabled="!enableBookButton"
        @click="sendAppointmentForBooking()"
      >
        Book Appointment
      </v-btn>

      <v-btn
        v-if="showEnableFeedbackButton"
        color="darkblue white--text"
        @click="showFeedbackDialog = true"
      >
        Provide Feedback
      </v-btn>
    </v-card-actions>
    <v-card-actions v-else>
      <v-spacer></v-spacer>

      <v-btn
        color="grey white--text"
        @click="
          showFeedbackDialog = false;
          $emit('closeAppointmentDialog');
        "
      >
        Close
      </v-btn>

      <v-btn
        v-if="showEnableFeedbackButton"
        color="darkblue white--text"
        @click="showFeedbackDialog = false"
      >
        See Appointment Details
      </v-btn>

      <v-btn
        v-if="showEnableFeedbackButton"
        :disabled="
          !(
            (updatedPersonAppointment.feedbacknumber > 0 &&
              updatedPersonAppointment.feedbacktext !== '') ||
            isNoShow ||
            isNoAccept
          )
        "
        color="accent"
        @click="saveFeedback()"
      >
        Save Feedback
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="showDeleteConfirmation" persistent max-width="750px">
      <DeleteConfirmationComponent
        type="appointment"
        :item="appointment"
        @handleReturningCancel="showDeleteConfirmation = false"
        @handleReturningSuccess="directToCancel()"
      ></DeleteConfirmationComponent>
    </v-dialog>
  </v-card>
</template>

<script>
import AppointmentServices from "@/services/appointmentServices.js";
import PersonServices from "@/services/personServices.js";
import PersonAppointmentServices from "@/services/personAppointmentServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import RoleServices from "@/services/roleServices.js";
import LocationServices from "@/services/locationServices.js";
import TopicServices from "@/services/topicServices.js";
import Utils from "@/config/utils.js";
import DeleteConfirmationComponent from "./DeleteConfirmationComponent.vue";
import { CalendarMixin } from "../mixins/CalendarMixin";
import { TimeFunctionsMixin } from "../mixins/TimeFunctionsMixin";

export default {
  name: "AppointmentDialogBody",
  components: {
    DeleteConfirmationComponent,
  },
  mixins: [CalendarMixin, TimeFunctionsMixin],
  props: {
    sentAppointment: {
      type: [Object],
      default() {
        return {
          URL: "",
          color: "",
          date: "",
          displayedEnd: "",
          displayedStart: "",
          endTime: "",
          googleEventId: 0,
          group: {
            name: "",
            bookPastMinutes: 0,
          },
          groupId: 0,
          id: 0,
          location: {
            name: "",
            type: "",
          },
          locationId: 0,
          name: "",
          newStart: "",
          newEnd: "",
          personappointment: [],
          personRolePrivileges: [],
          preSessionInfo: "",
          startTime: "",
          status: "",
          students: [],
          topic: {
            name: "",
          },
          topicId: 0,
          tutors: [],
          type: "",
        };
      },
    },
  },
  data() {
    return {
      user: {},
      addedStudent: {
        id: "",
        email: "",
        fName: "",
        lName: "",
        personRoleId: "",
      },
      updatedPersonAppointment: {
        id: "",
        personId: "",
        appointmentId: "",
        isTutor: 0,
        feedbacktext: "",
        feedbacknumber: 0,
      },
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
      locations: [],
      statuses: ["Booked", "Pending"],
      newStatus: "Available",
      currentTopics: [],
      appointment: this.sentAppointment,
      startTimes: [],
      endTimes: [],
      studentString: "",
      tutorString: "",
      emailStatus: "",
      allowAdminAddStudent: false,
      canEditLocation: false,
      canEditTopic: false,
      canEditFirstTime: false,
      canEditSecondTime: false,
      canEditPreSession: false,
      canSplitTime: false,
      enableBookButton: false,
      isAdminAddStudent: false,
      isMemberOfAppointment: false,
      isNoShow: false,
      isNoAccept: false,
      needStudentInfo: false,
      saveChanges: false,
      showBookButton: false,
      showDeleteConfirmation: false,
      showFeedbackDialog: false,
      showSaveButton: false,
      showEnableCancelButton: false,
      showEnableConfirmRejectButtons: false,
      showEnableFeedbackButton: false,
      showEnableSignUpButton: false,
      tutorSetLocation: false,
    };
  },
  watch: {
    async sentAppointment(newAppointment) {
      this.appointment = newAppointment;
      if (
        this.checkAppointmentType("Private") &&
        this.checkAppointmentStatus("available") &&
        this.appointment.group.allowSplittingAppointments &&
        this.subtractTimes(
          this.appointment.startTime,
          this.appointment.endTime
        ) >= this.appointment.group.minApptTime
      ) {
        this.appointment.displayedStart = "";
        this.appointment.displayedEnd = "";
      } else {
        this.appointment.displayedStart = this.appointment.startTime;
        this.appointment.displayedEnd = this.appointment.endTime;
      }
      await this.resetEverything();
    },
  },
  async created() {
    await this.resetEverything();
  },
  methods: {
    checkButtons() {
      this.saveChanges = true;
      this.setShowBookButton();
      this.setEnableBookButton();
      this.setShowEnableConfirmRejectButtons();
      this.setShowEnableSignUpButton();
      this.setShowSaveButton();
      this.setShowEnableCancelButton();
      this.setShowEnableFeedbackButton();
    },
    async resetEverything() {
      this.user = Utils.getStore("user");
      if (
        this.checkAppointmentType("Private") &&
        this.checkAppointmentStatus("available") &&
        this.appointment.group.allowSplittingAppointments &&
        this.subtractTimes(
          this.appointment.startTime,
          this.appointment.endTime
        ) >= this.appointment.group.minApptTime
      ) {
        this.appointment.displayedStart = "";
        this.appointment.displayedEnd = "";
      } else {
        this.appointment.displayedStart = this.appointment.startTime;
        this.appointment.displayedEnd = this.appointment.endTime;
      }
      this.addedStudent = {
        id: "",
        fName: "",
        lName: "",
        email: "",
        personRoleId: "",
      };
      this.updatedPersonAppointment = {
        id: "",
        personId: "",
        appointmentId: "",
        isTutor: 0,
        feedbacktext: "",
        feedbacknumber: 0,
      };
      this.tutorString = "";
      this.studentString = "";
      this.emailStatus = "";
      this.newStatus = "Available";
      this.allowAdminAddStudent = false;
      this.isAdminAddStudent = false;
      this.isNoShow = false;
      this.isNoAccept = false;
      this.needStudentInfo = false;
      this.saveChanges = false;
      this.showFeedbackDialog =
        this.appointment.showFeedbackDialog !== undefined
          ? this.appointment.showFeedbackDialog
          : false;
      this.tutorSetLocation =
        this.appointment.locationId !== null ? true : false;
      this.updateTimes();
      this.setupPersonStrings();
      this.setCanSplitTime();
      this.setCanEditLocation();
      this.setCanEditTopic();
      this.setCanEditFirstTime();
      this.setCanEditPreSession();
      this.setShowBookButton();
      this.setEnableBookButton();
      this.setShowEnableConfirmRejectButtons();
      this.setShowEnableSignUpButton();
      this.setShowSaveButton();
      this.setShowEnableCancelButton();
      this.setShowEnableFeedbackButton();
      await this.getLocationsForGroup();
      await this.getTopicsForTutor();
    },
    setupPersonStrings() {
      this.tutorString += `${this.appointment.tutors[0].person.fName} ${this.appointment.tutors[0].person.lName}`;

      if (this.appointment.tutors.length > 1) {
        for (let i = 1; i < this.appointment.tutors.length; i++) {
          this.tutorString += `, ${this.appointment.tutors[i].person.fName} ${this.appointment.tutors[i].person.lName}`;
        }
      }

      if (this.appointment.students.length > 1) {
        this.appointment.students.forEach((student) => {
          this.studentString += `${student.person.fName} ${student.person.lName}, `;
        });
      } else if (this.appointment.students.length === 1) {
        this.studentString += `${this.appointment.students[0].person.fName} ${this.appointment.students[0].person.lName}`;
      } else {
        this.studentString = "---";
      }
    },
    setCanEditLocation() {
      // 1. tutor - owned private booked, group
      // 2. student - owned private pending, private available
      // 3. privilege tutor - private not booked
      // 4. admin
      // 5. not cancelled or past (applies to all cases)
      this.canEditLocation =
        ((this.hasRole("Tutor") &&
          this.appointment.isTutor &&
          ((this.checkAppointmentType("Private") &&
            this.checkAppointmentStatus("booked")) ||
            this.checkAppointmentType("Group"))) ||
          (this.hasRole("Student") &&
            this.appointment.locationId == null &&
            this.checkAppointmentType("Private") &&
            (this.checkAppointmentStatus("available") ||
              (this.appointment.isStudent &&
                this.checkAppointmentStatus("pending")))) ||
          (this.hasPrivilege("Sign up students for appointments") &&
            this.checkAppointmentType("Private") &&
            !this.checkAppointmentStatus("booked")) ||
          this.hasRole("Admin")) &&
        !this.checkAppointmentStatus("Cancel") &&
        !this.appointment.isDatePast;
    },
    setCanEditTopic() {
      // 1. tutor - owned group with no students
      // 2. student - owned private pending, private available
      // 3. admin - group with no students, private not booked
      // 4. privilege tutor - private not booked
      // 5. not cancelled or past (applies to all cases)
      this.canEditTopic =
        ((this.hasRole("Tutor") &&
          this.appointment.isTutor &&
          this.checkAppointmentType("Group") &&
          this.appointment.students.length === 0) ||
          (this.hasRole("Student") &&
            this.checkAppointmentType("Private") &&
            (this.checkAppointmentStatus("available") ||
              (this.appointment.isStudent &&
                this.checkAppointmentStatus("pending")))) ||
          (this.hasRole("Admin") &&
            this.checkAppointmentType("Group") &&
            this.appointment.students.length === 0) ||
          ((this.hasRole("Admin") ||
            this.hasPrivilege("Sign up students for appointments")) &&
            this.checkAppointmentType("Private") &&
            !this.checkAppointmentStatus("booked"))) &&
        !this.checkAppointmentStatus("Cancel") &&
        !this.appointment.isDatePast;
    },
    setCanEditFirstTime() {
      // 1. student - available private
      // 2. privilege tutor - available private
      // 3. admin - available private
      // 4. group allows splitting (applies to all cases)
      // 5. start and end time of appointment is >= minimum appointment time (applies to all cases)
      // 6. not past (applies to all cases)
      this.canEditFirstTime =
        (this.hasRole("Student") ||
          this.hasRole("Admin") ||
          this.hasPrivilege("Sign up students for appointments")) &&
        this.checkAppointmentType("Private") &&
        this.checkAppointmentStatus("available") &&
        this.appointment.group.allowSplittingAppointments &&
        this.canSplitTime &&
        !this.appointment.isDatePast;
    },
    setCanEditPreSession() {
      // 1. tutor - owned group
      // 2. student - owned private (pending, available, booked)
      // 3. privilege tutor - private not booked
      // 4. admin
      // 5. not cancelled or past (applies to all cases)
      this.canEditPreSession =
        ((this.hasRole("Tutor") &&
          this.appointment.isTutor &&
          this.checkAppointmentType("Group")) ||
          (this.hasRole("Student") &&
            this.checkAppointmentType("Private") &&
            (this.checkAppointmentStatus("available") ||
              (this.appointment.isStudent &&
                (this.checkAppointmentStatus("pending") ||
                  this.checkAppointmentStatus("booked"))))) ||
          (this.hasPrivilege("Sign up students for appointments") &&
            this.checkAppointmentType("Private") &&
            !this.checkAppointmentStatus("booked")) ||
          this.hasRole("Admin")) &&
        !this.checkAppointmentStatus("Cancel") &&
        !this.appointment.isDatePast;
    },
    setShowBookButton() {
      // 1. student - available but not already in group appointment
      // 2, privilege tutor - available
      // 3. admin - available
      // 4. tutor - group available but not already in group appointment
      // 4. not past (applies to all cases)
      this.showBookButton =
        ((((this.hasRole("Student") &&
          !this.appointment.isMemberOfAppointment) ||
          this.hasRole("Admin") ||
          this.hasPrivilege("Sign up students for appointments")) &&
          this.checkAppointmentStatus("available")) ||
          (this.hasRole("Tutor") &&
            !this.appointment.isMemberOfAppointment &&
            this.checkAppointmentType("Group") &&
            this.checkAppointmentStatus("available"))) &&
        !this.appointment.isDatePast;
    },
    setEnableBookButton() {
      // 1. student - group available, private available with topic, location, start, and end time filled out
      // 2. privilege tutor - group available and student signed up, private available with student signed up and topic, location, start, and end time filled out
      // 3. admin - group available and student signed up, private available with student signed up and topic, location, start, and end time filled out
      // 4. tutor - group available
      // 4. not past (applies to all cases)
      this.enableBookButton =
        (this.hasRole("Student") ||
          (this.hasRole("Tutor") &&
            this.checkAppointmentType("Group") &&
            !this.appointment.isTutor) ||
          ((this.hasRole("Admin") ||
            this.hasPrivilege("Sign up students for appointments")) &&
            this.isAdminAddStudent &&
            this.addedStudent.fName !== "" &&
            this.addedStudent.lName !== "" &&
            this.allowAdminAddStudent &&
            (this.checkAppointmentType("Group") ||
              (this.checkAppointmentType("Private") &&
                this.newStatus !== "available")))) &&
        this.checkAppointmentStatus("available") &&
        (this.checkAppointmentType("Group") ||
          (this.checkAppointmentType("Private") &&
            this.appointment.topicId !== null &&
            this.appointment.locationId !== null &&
            this.displayedStart !== "" &&
            this.displayedEnd !== "")) &&
        !this.appointment.isDatePast;
    },
    setShowEnableConfirmRejectButtons() {
      // 1. tutor and pending private
      // 2. not past (applies to all cases)
      this.showEnableConfirmRejectButtons =
        this.appointment.isTutor &&
        this.checkAppointmentStatus("pending") &&
        this.checkAppointmentType("Private") &&
        !this.appointment.isDatePast;
    },
    setShowSaveButton() {
      // 1. if user can edit anything
      this.showSaveButton =
        ((this.appointment.isTutor && this.checkAppointmentType("Group")) ||
          !this.checkAppointmentStatus("available")) &&
        (this.canEditLocation || this.canEditTopic || this.canEditPreSession) &&
        !this.isAdminAddStudent;
    },
    setShowEnableSignUpButton() {
      // 1. privilege tutor or admin and available appointment
      // 2. not past (applies to all cases)
      this.showEnableSignUpButton =
        (this.hasRole("Admin") ||
          this.hasPrivilege("Sign up students for appointments")) &&
        this.checkAppointmentStatus("available") &&
        !this.appointment.isDatePast;
    },
    setShowEnableCancelButton() {
      // 1. student - owned pending, booked, and group
      // 2. tutor - owned available, booked, and group appointments
      // 3. admin?
      // 4. privilege tutor?
      // 5. not past (applies to all cases)

      this.showEnableCancelButton =
        ((this.hasRole("Student") &&
          this.appointment.isStudent &&
          (this.checkAppointmentType("Group") ||
            !this.checkAppointmentStatus("available"))) ||
          (this.hasRole("Tutor") &&
            this.appointment.isTutor &&
            !this.checkAppointmentStatus("pending")) ||
          this.hasRole("Admin")) &&
        !this.appointment.isDatePast &&
        !this.checkAppointmentStatus("Cancel");
    },
    setShowEnableFeedbackButton() {
      // 1. student - owned complete and feedbacktext null
      // 2. tutor - owned booked, group and feedbacktext null
      this.showEnableFeedbackButton =
        ((this.hasRole("Student") &&
          this.appointment.isStudent &&
          this.checkAppointmentStatus("complete") &&
          this.appointment.isStudent.feedbacktext === null) ||
          (this.hasRole("Tutor") &&
            this.appointment.isTutor &&
            (this.checkAppointmentStatus("booked") ||
              this.checkAppointmentStatus("pending") ||
              this.checkAppointmentType("Group")) &&
            this.appointment.isTutor.feedbacktext === null)) &&
        this.appointment.isDatePast;
    },
    setCanSplitTime() {
      this.canSplitTime =
        this.subtractTimes(
          this.appointment.startTime,
          this.appointment.endTime
        ) >= this.appointment.group.minApptTime;
    },
    adminCheckPersonInAppointment(personId) {
      return this.appointment.personappointment.find((person) => {
        return person.personId === personId;
      });
    },
    hasRole(type) {
      return (
        this.user.selectedRole.type !== null &&
        this.user.selectedRole.type === type
      );
    },
    hasPrivilege(privilege) {
      return this.appointment.personRolePrivileges.find((priv) => {
        return priv.privilege === privilege;
      });
    },
    checkAppointmentStatus(status) {
      return (
        this.appointment !== null && this.appointment.status.includes(status)
      );
    },
    checkAppointmentType(type) {
      return this.appointment !== null && this.appointment.type === type;
    },
    updateTimes() {
      this.startTimes = this.generateTimeSlots(
        this.appointment.startTime,
        this.appointment.newEnd,
        this.appointment.group.timeInterval
      );
      // adding this to make sure that you can't start an appointment at the end time
      // need to make sure that we handle the time interval vs the minimum appointment time correctly
      for (
        let i = 0;
        i <
        this.appointment.group.minApptTime /
          this.appointment.group.timeInterval;
        i++
      ) {
        this.startTimes.pop();
      }
      this.endTimes = this.generateTimeSlots(
        this.appointment.newStart,
        this.appointment.endTime,
        this.appointment.group.minApptTime
      );
      // adding this to make sure you can't end an appointment at the start time
      this.endTimes.shift();
    },
    async findEmail() {
      await PersonServices.getStudentForPersonForGroup(
        this.addedStudent.email,
        this.appointment.groupId
      ).then((response) => {
        if (response.data.length > 0) {
          this.addedStudent = {
            id: response.data[0].id,
            fName: response.data[0].fName,
            lName: response.data[0].lName,
            email: response.data[0].email,
            personRoleId:
              response.data[0].personrole.length > 0
                ? response.data[0].personrole[0].id
                : "",
          };
        } else {
          this.addedStudent = {
            id: "",
            fName: "",
            lName: "",
            email: this.addedStudent.email,
            personRoleId: "",
          };
        }
      });
      if (this.user.userID === this.addedStudent.id) {
        this.emailStatus = "You cannot sign yourself up for an appointment.";
      } else if (
        this.appointment.tutors.find((tutor) => {
          return tutor.personId === this.addedStudent.id;
        })
      ) {
        this.emailStatus =
          "You cannot sign up a tutor for their own appointment.";
      } else if (this.adminCheckPersonInAppointment(this.addedStudent.id)) {
        this.emailStatus = `${this.addedStudent.fName}
            ${this.addedStudent.lName} is already signed up for this appointment.`;
      } else if (this.addedStudent.id !== "") {
        this.allowAdminAddStudent = true;
        this.needStudentInfo = false;
        if (
          this.addedStudent.personRoleId === "" ||
          this.addedStudent.personRoleId === null
        ) {
          let studentRoleId = await RoleServices.getAllForGroupByType(
            this.appointment.groupId,
            "Student"
          ).then((response) => {
            return response.data[0].id;
          });
          let personRole = {
            status: "applied",
            roleId: studentRoleId,
            personId: this.addedStudent.id,
            dateSigned: Date(),
            agree: false,
          };
          await PersonRoleServices.addPersonRole(personRole);
          this.emailStatus = `${this.addedStudent.fName}
            ${this.addedStudent.lName} has been added as a student!`;
        } else {
          this.emailStatus = `${this.addedStudent.fName}
            ${this.addedStudent.lName} is a student in ${this.appointment.group.name}!`;
        }
      } else {
        this.needStudentInfo = true;
        this.allowAdminAddStudent = true;
        this.emailStatus = `Not found in ${this.appointment.group.name}.`;
      }
      this.checkButtons();
    },
    validateEmail() {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let email = pattern.test(this.addedStudent.email);
      return email
        ? this.addedStudent.email.includes("oc.edu") ||
            this.addedStudent.email.includes("eagles.oc.edu")
        : false;
    },
    async adminAdd() {
      let student = {
        fName: this.addedStudent.fName,
        lName: this.addedStudent.lName,
        email: this.addedStudent.email,
      };
      await PersonServices.addPerson(student).then((response) => {
        this.addedStudent = {
          id: response.data.id,
          fName: response.data.fName,
          lName: response.data.lName,
          email: response.data.email,
          personRoleId: null,
        };
      });
      let studentRoleId = await RoleServices.getAllForGroupByType(
        this.appointment.groupId,
        "Student"
      ).then((response) => {
        return response.data[0].id;
      });
      let personRole = {
        status: "applied",
        roleId: studentRoleId,
        personId: this.addedStudent.id,
        dateSigned: Date(),
        agree: false,
      };
      await PersonRoleServices.addPersonRole(personRole);
    },
    async directToCancel() {
      this.showDeleteConfirmation = false;
      let fromUser = {
        fName: this.user.fName,
        lName: this.user.lName,
        userID: this.user.userID,
        type: this.user.selectedRole.type,
      };
      await AppointmentServices.cancelAppointment(
        this.appointment.id,
        fromUser
      ).catch((error) => {
        this.alertType = "error";
        this.alert = error.response.data.message;
        this.showAlert = true;
        console.log("There was an error:", error.response);
      });
      this.$emit("doneWithAppointment");
    },
    async sendAppointmentForConfirmation() {
      await this.confirmAppointment(true, this.user, this.appointment);
      this.$emit("doneWithAppointment");
    },
    async sendAppointmentForBooking() {
      if (this.isAdminAddStudent) {
        if (this.checkAppointmentType("Private")) {
          // set status that admin chose
          this.appointment.status = this.newStatus.toLowerCase();
        }
        if (this.needStudentInfo) {
          await this.adminAdd();
        }
      }
      this.appointment.minApptTime = this.appointment.group.minApptTime;

      await this.bookAppointment(
        this.isAdminAddStudent,
        this.appointment,
        this.user,
        this.addedStudent,
        this.tutorSetLocation
      );
      this.$emit("doneWithAppointment");
    },
    async getLocationsForGroup() {
      await LocationServices.getActiveForGroup(this.appointment.groupId)
        .then((response) => {
          this.locations = response.data;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    async getTopicsForTutor() {
      await TopicServices.getTopicByGroupForPerson(
        this.appointment.groupId,
        this.appointment.tutors[0].personId
      )
        .then((response) => {
          this.currentTopics = response.data;
          // there are cases where the change in tutors may have created an appointment that the main tutor is not assigned to
          if (
            this.currentTopics.find(
              (topic) => topic.id === this.appointment.topicId
            ) === undefined
          ) {
            this.currentTopics.push(this.appointment.topic);
          }
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    updateFeedbackText() {
      if (this.isNoShow) {
        this.updatedPersonAppointment.feedbacknumber = 0;
        if (this.appointment.students.length === 1) {
          this.updatedPersonAppointment.feedbacktext = `${this.appointment.students[0].person.fName} ${this.appointment.students[0].person.lName} did not show up to our appointment.`;
        } else {
          this.updatedPersonAppointment.feedbacktext =
            "No students showed up to our appointment.";
        }
      } else if (this.isNoAccept) {
        this.updatedPersonAppointment.feedbacknumber = 0;
        if (this.appointment.students.length === 1) {
          this.updatedPersonAppointment.feedbacktext = `${this.appointment.students[0].person.fName} ${this.appointment.students[0].person.lName} did not accept Appointment.`;
        } else {
          this.updatedPersonAppointment.feedbacktext =
            "Tutor did not Accept the appointment.";
        }
      } else {
        this.updatedPersonAppointment.feedbacktext = "";
        if (this.updatedPersonAppointment.feedbacknumber == null) {
          this.updatedPersonAppointment.feedbacknumber = 0;
        }
      }
    },
    async saveFeedback() {
      if (this.hasRole("Tutor")) {
        let updatedAppointment = {
          id: this.appointment.id,
          date: this.appointment.date,
          startTime: this.appointment.startTime,
          endTime: this.appointment.endTime,
          status: this.appointment.status,
          type: this.appointment.type,
          preSessionInfo: this.appointment.preSessionInfo,
          groupId: this.appointment.groupId,
          locationId: this.appointment.locationId,
          topicId: this.appointment.topicId,
          googleEventId: this.appointment.googleEventId,
        };
        updatedAppointment.status = this.isNoShow
          ? "noShow"
          : this.isNoAccept
          ? "noAccept"
          : "complete";

        await AppointmentServices.updateAppointment(
          updatedAppointment.id,
          updatedAppointment
        ).catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
      }

      this.updatedPersonAppointment.appointmentId = this.appointment.id;

      if ((this.isNoShow || this.isNoAccept) && this.hasRole("Tutor")) {
        // want to save the no show feedback for every person in the appointment
        for (let i = 0; i < this.appointment.personappointment.length; i++) {
          this.updatedPersonAppointment.feedbacknumber = null;
          this.updatedPersonAppointment.id =
            this.appointment.personappointment[i].id;
          this.updatedPersonAppointment.personId =
            this.appointment.personappointment[i].personId;
          this.updatedPersonAppointment.isTutor =
            this.appointment.personappointment[i].isTutor;
          await PersonAppointmentServices.updatePersonAppointment(
            this.updatedPersonAppointment.id,
            this.updatedPersonAppointment
          ).catch((error) => {
            this.alertType = "error";
            this.alert = error.response.data.message;
            this.showAlert = true;
            console.log("There was an error:", error.response);
          });
        }
      } else {
        this.updatedPersonAppointment.id =
          this.appointment.isMemberOfAppointment.id;
        this.updatedPersonAppointment.personId =
          this.appointment.isMemberOfAppointment.personId;
        this.updatedPersonAppointment.isTutor =
          this.appointment.isMemberOfAppointment.isTutor;
        await PersonAppointmentServices.updatePersonAppointment(
          this.updatedPersonAppointment.id,
          this.updatedPersonAppointment
        ).catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
      }

      this.showFeedbackDialog = false;
      this.$emit("doneWithAppointment");
    },
  },
};
</script>

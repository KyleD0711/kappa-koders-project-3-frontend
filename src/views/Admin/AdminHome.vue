<template>
  <div>
    <v-container>
      <v-card-title
        class="text-h4 font-weight-bold pt-4 pb-6 pl-0 pr-0 accent--text"
        >Hello, {{ user.fName }}!
        <InformationComponent :message="headerMessage"></InformationComponent>
        <v-spacer></v-spacer>
        <v-card-title class="text-right pt-0 pb-0 pl-0 pr-0 accent--text"
          >Admin</v-card-title
        >
      </v-card-title>
      <v-alert v-model="showAlert" dismissible :type="alertType">{{
        alert
      }}</v-alert>
      <br />
      <div v-if="approved">
        <v-row justify="center">
          <v-col justify="center">
            <v-card>
              <v-card-title>
                Upcoming Appointment Hours - {{ user.selectedGroup }}
                <v-spacer></v-spacer>
                <InformationComponent
                  message="View a breakdown of appointment hours for last week, this
                  week, and next week."
                ></InformationComponent>
              </v-card-title>
              <apexchart
                ref="chart"
                width="700"
                type="bar"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </v-card>
          </v-col>
          <v-col justify="center">
            <v-row justify="center">
              <v-card
                class="mx-auto my-3 justify-center"
                @click="
                  handleRedundantNavigation(
                    'requestList',
                    user.selectedRole.personRoleId
                  )
                "
              >
                <v-card-title>
                  Student Requests
                  <v-spacer></v-spacer>
                  <InformationComponent
                    message="Click here to view requests."
                  ></InformationComponent>
                </v-card-title>
                <apexchart
                  width="380"
                  type="pie"
                  :options="pieOptions"
                  :series="pieSeries"
                ></apexchart>
                <br />
              </v-card>
            </v-row>
            <v-row justify="center">
              <v-card
                class="mx-auto my-5 justify-center"
                @click="
                  handleRedundantNavigation(
                    'adminApprove',
                    user.selectedRole.personRoleId
                  )
                "
              >
                <v-card-title>
                  Tutor Applications
                  <v-spacer></v-spacer>
                  <InformationComponent
                    message="Click here to view applications."
                  ></InformationComponent>
                </v-card-title>
                <v-card-text class="text-center">
                  <h1>{{ applicationNum }}</h1>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-card class="tutor">
              <v-card-title>
                Tutors For Week Starting {{ currentWeek }}
                <v-spacer></v-spacer>
                <InformationComponent
                  message="View a breakdown of the appointment hours for each tutor."
                ></InformationComponent>
              </v-card-title>
              <v-data-table
                :headers="tutorTable"
                :search="search"
                :items="tutors"
                :items-per-page="50"
              ></v-data-table>
            </v-card>
            <br />
          </v-col>
          <v-col>
            <v-card class="tutor">
              <v-card-title>
                Topics For Week Starting {{ currentWeek }}
                <v-spacer></v-spacer>
                <InformationComponent
                  message="View a breakdown of the appointment hours for each topic."
                ></InformationComponent>
              </v-card-title>
              <v-data-table
                :headers="topicTable"
                :search="search"
                :items="topics"
                :items-per-page="50"
              ></v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div v-else-if="!disabled && !approved">
        <h4>Pending supervisor's approval...</h4>
      </div>
      <div v-else>
        <h4>
          This role for {{ group.name }} has been disabled. Please contact a
          group admin for further questions.
        </h4>
      </div>

      <br /><br />
    </v-container>
  </div>
</template>

<script src="//cdnjs.cloudflare.com/ajax/libs/vue/2.1.10/vue.min.js"></script>
<script src="//unpkg.com/vue-chartjs@2.6.0/dist/vue-chartjs.full.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.js"></script>
<script src="//unpkg.com/hchs-vue-charts@1.2.8"></script>

<script>
import Utils from "@/config/utils.js";
import AppointmentServices from "@/services/appointmentServices.js";
import RequestServices from "@/services/requestServices.js";
import TopicServices from "@/services/topicServices.js";
import PersonServices from "@/services/personServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import InformationComponent from "@/components/InformationComponent.vue";
import { RedirectToPageMixin } from "@/mixins/RedirectToPageMixin";
import { TimeFunctionsMixin } from "@/mixins/TimeFunctionsMixin";
import "@/plugins/apexcharts";

export default {
  name: "AdminHome",
  mixins: [RedirectToPageMixin, TimeFunctionsMixin],
  components: {
    InformationComponent,
  },
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      headerMessage: "",
      showAlert: false,
      alert: "",
      alertType: "success",
      series: [],
      pieSeries: [],
      search: "",
      user: {},
      group: {},
      approved: false,
      disabled: false,
      requests: {},
      receivedRequests: 0,
      completedRequests: 0,
      inProgressRequests: 0,
      applicationNum: 0,
      currentWeek: [],
      weekList: [],
      weeks: [],
      tutors: [],
      topics: [],
      appointments: [],
      apptCount: [],
      availableCount: [],
      groupCount: [],
      pendingCount: [],
      hourCount: [],
      completeCount: [],
      noShowCount: [],
      bookedCount: [],
      week: [],
      // table headers
      tutorTable: [
        { text: "Name", value: "name" },
        { text: "# Appointments", value: "apptCount" },
        { text: "# Total Hours", value: "hours" },
        { text: "# Hours to Pay", value: "payingHours" },
      ],
      topicTable: [
        { text: "Topic Name", value: "name" },
        { text: "# Booked Hours", value: "hours" },
        { text: "# Potential Hours", value: "potentialHours" },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
        },
        xaxis: {
          categories: [],
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        colors: ["grey", "#F8C545", "#EE5044", "#63BAC0", "#196CA2", "#032F45"],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        legend: {
          position: "top",
          // offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      },
      pieOptions: {
        chart: {
          width: 380,
          type: "pie",
        },
        colors: ["#EE5044", "#F8C545", "#032F45"],
        labels: ["Received", "In-Progress", "Complete"],
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex];
          },
        },
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
      },
    };
  },
  watch: {
    id: function () {
      this.getAdminRole();
    },
  },
  async created() {
    this.user = Utils.getStore("user");
    if (this.id !== 0) {
      await this.getAdminRole();
    }
    this.headerMessage =
      "Welcome to your personalized dashboard for " +
      this.user.selectedGroup +
      ". View information on appointment hours, tutor hours, and topic hours for the week. Click on the Student Requests chart to view requests. Click on Tutor Applications to view applications.";

    await this.getGroupByPersonRoleId();
    if (this.approved) {
      await this.setWeeks();
      await this.setTutorHours();
      await this.getTopics();
      await this.getRequests();
      await this.getTutorApplications();
    }
  },
  methods: {
    async getAdminRole() {
      await PersonRoleServices.getPersonRole(this.id)
        .then((response) => {
          if (
            response.data.status.includes("approved") ||
            response.data.status.includes("Approved")
          ) {
            this.approved = true;
          } else if (
            response.data.status.includes("applied") ||
            response.data.status.includes("Applied")
          )
            this.approved = false;
          if (response.data.status.includes("disabled")) {
            this.disabled = true;
          } else this.disabled = false;
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
    async setWeeks() {
      this.setWeekList();
      var totalHourList = [];
      var totalAvailableList = [];
      var totalGroupList = [];
      var totalPendingList = [];
      var totalBookedList = [];
      var totalCompleteList = [];
      var totalNoShowList = [];

      for (let index = 0; index < this.weekList.length; ++index) {
        var currWeek = "";
        var apptCount = "";
        var hourCount = "";
        var availableCount = "";
        var groupCount = "";
        var pendingCount = "";
        var bookedCount = "";
        var completeCount = "";
        var noShowCount = "";

        let element = this.weekList[index];
        await AppointmentServices.getAppointmentHourCount(
          this.group.id,
          element
        )
          .then((responseHour) => {
            currWeek = element.slice(0, 10);
            apptCount = responseHour.data[0].count;
            hourCount = responseHour.data[0].hours;
            availableCount = responseHour.data[0].available;
            groupCount = responseHour.data[0].group;
            pendingCount = responseHour.data[0].pending;
            bookedCount = responseHour.data[0].booked;
            completeCount = responseHour.data[0].complete;
            noShowCount = responseHour.data[0].noshow;

            if (index == 1) {
              this.week = currWeek;
              this.apptCount = apptCount;
              this.hourCount = hourCount;
              this.availableCount = availableCount;
              this.groupCount = groupCount;
              this.pendingCount = pendingCount;
              this.bookedCount = bookedCount;
              this.completeCount = completeCount;
              this.noShowCount = noShowCount;
            }
          })
          .catch((error) => {
            this.alertType = "error";
            this.alert = error.response.data.message;
            this.showAlert = true;
            console.log(
              "There was an error getting hour count:",
              error.responseHour
            );
          });

        this.weeks.push({
          week: currWeek,
          appointmentNum: this.checkNum(apptCount),
          hours: this.checkHours(hourCount),
          availableAppointments: this.checkHours(availableCount),
          completedAppointments: this.checkHours(completeCount),
          scheduledAppointments: this.checkHours(bookedCount),
        });

        totalHourList.push(hourCount);
        totalAvailableList.push(availableCount);
        totalGroupList.push(groupCount);
        totalPendingList.push(pendingCount);
        totalBookedList.push(bookedCount);
        totalCompleteList.push(completeCount);
        totalNoShowList.push(noShowCount);
      }

      this.series.push(
        JSON.parse(
          "{" +
            '"name": "Private Available",' +
            '"data": [' +
            this.numifyHours(totalAvailableList[0]) +
            ", " +
            this.numifyHours(totalAvailableList[1]) +
            ", " +
            this.numifyHours(totalAvailableList[2]) +
            "]" +
            "}"
        )
      );

      this.series.push(
        JSON.parse(
          "{" +
            '"name": "Pending",' +
            '"data": [' +
            this.numifyHours(totalPendingList[0]) +
            ", " +
            this.numifyHours(totalPendingList[1]) +
            ", " +
            this.numifyHours(totalPendingList[2]) +
            "]" +
            "}"
        )
      );

      this.series.push(
        JSON.parse(
          "{" +
            '"name": "No Show",' +
            '"data": [' +
            this.numifyHours(totalNoShowList[0]) +
            ", " +
            this.numifyHours(totalNoShowList[1]) +
            ", " +
            this.numifyHours(totalNoShowList[2]) +
            "]" +
            "}"
        )
      );

      this.series.push(
        JSON.parse(
          "{" +
            '"name": "Group Available",' +
            '"data": [' +
            this.numifyHours(totalGroupList[0]) +
            ", " +
            this.numifyHours(totalGroupList[1]) +
            ", " +
            this.numifyHours(totalGroupList[2]) +
            "]" +
            "}"
        )
      );

      this.series.push(
        JSON.parse(
          '{"' +
            'name": "Booked",' +
            '"data": [' +
            this.numifyHours(totalBookedList[0]) +
            ", " +
            this.numifyHours(totalBookedList[1]) +
            ", " +
            this.numifyHours(totalBookedList[2]) +
            "]" +
            "}"
        )
      );

      this.series.push(
        JSON.parse(
          "{" +
            '"name": "Completed",' +
            '"data": [' +
            this.numifyHours(totalCompleteList[0]) +
            ", " +
            this.numifyHours(totalCompleteList[1]) +
            ", " +
            this.numifyHours(totalCompleteList[2]) +
            "]" +
            "}"
        )
      );

      this.$refs.chart.updateOptions({
        xaxis: {
          categories: [this.weekList[0], this.weekList[1], this.weekList[2]],
        },
        decimalsInFloat: 1,
      });
    },
    async setTutorHours() {
      this.setWeekList();
      var currWeek = this.currentWeek.slice(0, 10);
      await PersonServices.getHoursPerTutor(this.group.id, currWeek)
        .then((responseHour) => {
          this.tutors = responseHour.data;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error getting hour count: ", error);
        });
      for (let i = 0; i < this.tutors.length; i++) {
        this.tutors[i].name = `${this.tutors[i].fName} ${this.tutors[i].lName}`;
        this.tutors[i].apptCount = this.checkNum(this.tutors[i].apptCount);
        this.tutors[i].hours = this.checkHours(this.tutors[i].hours);
        this.tutors[i].payingHours = this.checkHours(
          this.tutors[i].payingHours
        );
      }
    },
    async getTopics() {
      this.setWeekList();
      var currWeek = this.currentWeek.slice(0, 10);
      await TopicServices.getHoursPerTopic(this.group.id, currWeek)
        .then((responseHour) => {
          this.topics = responseHour.data;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error getting topic hour count: ", error);
        });

      for (let i = 0; i < this.topics.length; i++) {
        this.topics[i].hours = this.checkHours(this.topics[i].hours);
        this.topics[i].potentialHours = this.checkHours(
          this.topics[i].potentialHours
        );
      }
    },
    setWeekList() {
      let prev = this.getStartOfPreviousWeek();
      let current = this.getStartOfCurrentWeek();
      let next = this.getStartOfNextWeek();
      this.weekList = [prev, current, next];
      this.currentWeek = current;
    },
    checkNum(num) {
      if (!num) {
        return 0 + " total";
      }
      return num + " total";
    },
    async getTutorApplications() {
      await PersonServices.getPendingTutorsForGroup(this.group.id)
        .then((response) => {
          this.applicationNum = response.data.length;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    async getRequests() {
      await RequestServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.requests = response.data;
          for (let index = 0; index < this.requests.length; index++) {
            let request = this.requests[index];
            if (request.status === "In-Progress") {
              this.inProgressRequests++;
            } else if (request.status === "Received") {
              this.receivedRequests++;
            } else if (request.status === "Completed") {
              this.completedRequests++;
            }
          }

          this.pieSeries.push(this.receivedRequests);
          this.pieSeries.push(this.inProgressRequests);
          this.pieSeries.push(this.completedRequests);
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
  },
};
</script>

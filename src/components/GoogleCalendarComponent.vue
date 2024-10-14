<template>
  <div>
    <v-dialog v-model="googleCalendarDialog" persistent max-width="800">
      <v-card>
        <v-card-title class="primary white--text mb-6"
          >Please Provide Google Calendar Authorization
        </v-card-title>
        <v-card-text>
          Tutor Scheduling updates your Google calendar with appointments. You
          will now be asked to approve (or re-approve) that access via Google.
          You will be presented with a Google login and a Tutor Scheduling
          access request.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="accent"
            @click="
              googleCalendarDialog = false;
              doAuthorization();
            "
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </div>
</template>

<script>
import Utils from "@/config/utils.js";

export default {
  name: "GoogleCalendarComponent",
  data() {
    return {
      user: Utils.getStore("user"),
      showAlert: false,
      alert: "",
      alertType: "success",
      message: "",
      url: "",
      googleCalendarDialog: false,
    };
  },
  watch: {
    $route() {
      this.user = Utils.getStore("user");
      this.checkForAuthorization();
    },
  },
  created() {
    this.checkForAuthorization();
  },
  methods: {
    hasRole(type) {
      return (
        this.user !== null &&
        this.user.selectedRole !== null &&
        this.user.selectedRole.type !== null &&
        this.user.selectedRole.type === type
      );
    },
    checkForAuthorization() {
      var now = new Date().toISOString();
      if (
        this.user !== null &&
        this.user.refresh_token !== null &&
        this.user.refresh_token !== undefined &&
        this.user.refresh_token !== ""
      ) {
        if (now > this.user.expiration_date) {
          this.googleCalendarDialog = this.hasRole("Tutor");
        }
      } else {
        this.googleCalendarDialog = this.hasRole("Tutor");
      }
    },
    doAuthorization() {
      if (process.env.VUE_APP_CLIENT_URL.includes("localhost")) {
        this.url = "http://localhost/tutoring-api";
      } else {
        this.url = "/tutoring-api";
      }
      this.url += "/authorize/" + this.user.userID;

      const client = global.google.accounts.oauth2.initCodeClient({
        client_id: process.env.VUE_APP_CLIENT_ID,
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/calendar",
        ux_mode: "popup",
        callback: async (response) => {
          await fetch(this.url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Requested-With": "XMLHttpRequest",
              "Access-Control-Allow-Origin": "*",
            },
            body: "code=" + response.code,
          })
            .then((response) => response.json())
            .then((response) => {
              if (response.userInfo !== undefined) {
                let user = Utils.getStore("user");
                user.refresh_token = response.userInfo.refresh_token;
                user.expiration_date = response.userInfo.expiration_date;
                Utils.setStore("user", user);
                this.alert = response.message;
                this.alertType = "success";

                this.showAlert = true;
              } else {
                this.alert = response.message;
                this.alertType = "error";
                this.showAlert = true;
              }
            })
            .catch((error) => {
              this.alert =
                "There was an error authorizing your account. Please try again.";
              this.alertType = "error";
              this.showAlert = true;
              console.log(error);
            });
        },
      });
      client.requestCode();
    },
  },
};
</script>

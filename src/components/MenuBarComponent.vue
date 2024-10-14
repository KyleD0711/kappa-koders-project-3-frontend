<template>
  <div>
    <v-app-bar app color="primary" dark>
      <div @click="createLink()">
        <v-img
          class="mr-4"
          src="../assets/oc_logo_social.png"
          max-height="50"
          max-width="50"
          contain
        ></v-img>
      </div>
      <v-toolbar-title class="title">
        <div>{{ title }}</div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items
        v-for="item in activeMenus"
        :key="item.link"
        class="hidden-md-and-down"
      >
        <v-btn
          :ref="item.link"
          exact
          link
          :color="item.color"
          text
          @click="menuAction(item.name)"
        >
          {{ item.text }}
        </v-btn>
      </v-toolbar-items>
      <v-menu
        v-if="isUserPopulated() && selectedGroup != '' && isSelectedRoleValid()"
        offset-y
      >
        <template #activator="{ on, attrs }">
          <v-btn color="accent" dark v-bind="attrs" class="mr-4 ml-4" v-on="on">
            {{ selectedGroup }}
          </v-btn>
        </template>
        <v-list>
          <v-list-group
            v-for="group in user.access"
            :key="group.id"
            no-action
            @click.stop.prevent
          >
            <template #activator>
              <v-list-item-title v-text="group.name"></v-list-item-title>
            </template>

            <v-list-item
              v-for="role in group.roles"
              :key="role.personRoleId"
              @click="
                selectedRole = role;
                selectedGroup = group.name;
                saveGroupRole();
                menuAction(
                  selectedRole.type === 'Admin' ? 'adminHome' : 'home'
                );
              "
            >
              <v-list-item-content>
                <v-list-item-title v-text="role.type"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-menu>
      <v-menu
        v-if="isUserPopulated() && isSelectedRoleValid()"
        bottom
        min-width="200px"
        rounded
        offset-y
      >
        <template #activator="{ on, attrs }">
          <v-btn icon x-large v-bind="attrs" v-on="on">
            <v-avatar
              v-if="isUserPopulated() && isSelectedRoleValid()"
              color="secondary"
            >
              <span class="accent--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar color="secondary" class="mt-2 mb-2">
                <span class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
              <h3>{{ name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider
                v-if="selectedRole.type.includes('Admin')"
                class="my-3"
              ></v-divider>
              <v-btn
                v-if="selectedRole.type.includes('Admin')"
                depressed
                rounded
                text
                @click="menuAction('groupEdit')"
              >
                Group Settings
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="menuAction('myInfo')">
                My Info
              </v-btn>
              <v-divider
                v-if="!selectedRole.type.includes('Admin')"
                class="my-3"
              ></v-divider>
              <v-btn
                v-if="!selectedRole.type.includes('Admin')"
                depressed
                rounded
                text
                @click="openRegistration = true"
              >
                Apply
              </v-btn>
              <v-divider
                v-if="!selectedRole.type.includes('Admin')"
                class="my-3"
              ></v-divider>
              <v-btn
                v-if="!selectedRole.type.includes('Admin')"
                depressed
                rounded
                text
                @click="menuAction('help')"
              >
                Help
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout()"> Logout </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
      <v-app-bar-nav-icon
        v-if="isUserPopulated() && isSelectedRoleValid()"
        dark
        class="hidden-lg-and-up"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-if="drawer && isUserPopulated() && isSelectedRoleValid()"
      v-model="drawer"
      class="hidden-lg-and-up"
      app
      right
      :mini-variant.sync="$vuetify.breakpoint.smAndDown"
      color="primary"
    >
      <v-list>
        <v-list-item
          v-for="item in activeMenus"
          :key="item.text"
          exact
          :color="item.color"
          @click="menuAction(item.name)"
        >
          <v-list-item-action>
            <v-icon v-if="item.icon" color="white">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text"
              >{{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <RegistrationComponent
      v-if="user !== null && openRegistration"
      @closeRegistrationComponent="openRegistration = false"
    ></RegistrationComponent>

    <v-dialog
      v-if="hasRole('Student')"
      v-model="requestDialog"
      persistent
      max-width="800px"
    >
      <RequestDialogBody
        :sent-request="selectedRequest"
        :person-role-id="user.selectedRole.personRoleId"
        :sent-bool="false"
        @closeRequestDialog="requestDialog = false"
        @saveOrAddRequest="addRequest"
      ></RequestDialogBody>
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
import AuthServices from "@/services/authServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import RequestServices from "@/services/requestServices.js";
import RoleServices from "@/services/roleServices.js";
import TwilioServices from "@/services/twilioServices";
import RegistrationComponent from "../components/RegistrationComponent.vue";
import RequestDialogBody from "../components/RequestDialogBody.vue";
import { RedirectToPageMixin } from "../mixins/RedirectToPageMixin";

export default {
  name: "MenuBarComponent",
  components: {
    RegistrationComponent,
    RequestDialogBody,
  },
  mixins: [RedirectToPageMixin],
  data: () => ({
    user: {},
    drawer: false,
    title: "OC Tutoring",
    initials: "",
    name: "",
    roles: [],
    groups: [],
    selectedRequest: {},
    openRegistration: false,
    requestDialog: false,
    showAlert: false,
    alert: "",
    alertType: "success",
    incompleteGroups: [],
    hasTopics: true,
    selectedGroup: "",
    selectedRole: {
      type: "",
      personRoleId: 0,
    },
    activeMenus: [],
    menus: [
      {
        link: "adminHome",
        name: "adminHome",
        color: "white",
        text: "Home",
        icon: "mdi-home",
        roles: "HeadAdmin,Admin,Supervisor",
      },
      {
        link: "home",
        name: "home",
        color: "white",
        text: "Home",
        icon: "mdi-home",
        roles: "Tutor,Student",
      },
      {
        link: "calendar",
        name: "calendar",
        color: "white",
        text: "Calendar",
        icon: "mdi-calendar",
        roles: "HeadAdmin,Admin,Supervisor,Tutor,Student",
      },
      {
        link: "requestList",
        name: "requestList",
        color: "white",
        text: "Requests",
        icon: "mdi-alert",
        roles: "HeadAdmin,Admin,Supervisor",
      },
      {
        link: "personList",
        name: "personList",
        color: "white",
        text: "People",
        icon: "mdi-account-multiple",
        roles: "HeadAdmin,Admin,Supervisor",
      },
      {
        link: "adminApprove",
        name: "adminApprove",
        color: "white",
        text: "Applications",
        icon: "mdi-text-account",
        roles: "HeadAdmin,Admin,Supervisor",
      },
      {
        link: "topicList",
        name: "topicList",
        color: "white",
        text: "Topics",
        icon: "mdi-book",
        roles: "HeadAdmin,Admin,Supervisor",
      },
      {
        link: "roleList",
        name: "roleList",
        color: "white",
        text: "Roles",
        icon: "mdi-folder-account",
        roles: "HeadAdmin,Admin,Supervisor",
      },
      {
        link: "locationList",
        name: "locationList",
        color: "white",
        text: "Locations",
        icon: "mdi-map-marker",
        roles: "HeadAdmin,Admin,Supervisor",
      },
      {
        link: "adminReports",
        name: "adminReports",
        color: "white",
        text: "Reports",
        icon: "mdi-chart-line",
        roles: "HeadAdmin,Admin,Supervisor",
      },
      {
        link: "groupList",
        name: "groupList",
        color: "white",
        text: "Groups",
        roles: "Headdmin",
      },
      {
        link: "tutorAddAvailability",
        name: "tutorAddAvailability",
        color: "white",
        text: "Availability",
        icon: "mdi-clock",
        roles: "Tutor",
      },
      {
        link: "studentAddRequest",
        name: "studentAddRequest",
        color: "white",
        text: "Request",
        icon: "mdi-alert",
        roles: "Student",
      },
    ],
  }),
  async created() {
    // ensures that their name gets set properly from store
    this.user = Utils.getStore("user");
    if (this.isUserPopulated()) {
      this.title = "Tutor Scheduling";
      this.initials = this.user.fName[0] + this.user.lName[0];
      this.name = this.user.fName + " " + this.user.lName;
      this.selectedRole = this.user.selectedRole;
      this.selectedGroup = this.user.selectedGroup;
      await this.resetMenu();
    }
  },
  methods: {
    createLink() {
      if (this.isSelectedRoleValid()) {
        this.handleRedundantNavigation(
          this.selectedRole.type === "Admin" ? "adminHome" : "home",
          this.selectedRole.personRoleId
        );
      } else {
        this.handleRedundantNavigation("login", null);
      }
    },
    saveGroupRole() {
      this.user.selectedGroup = this.selectedGroup;
      this.user.selectedRole = this.selectedRole;
      Utils.setStore("user", this.user);
      this.resetMenu();
    },
    isUserPopulated() {
      return JSON.stringify(this.user) !== "{}" && this.user !== null;
    },
    isSelectedRoleValid() {
      return (
        this.selectedRole !== undefined &&
        this.selectedRole.personRoleId !== 0 &&
        this.selectedRole.type !== "" &&
        this.selectedRole.type !== undefined &&
        this.selectedRole.type !== null
      );
    },
    hasRole(type) {
      return (
        this.user !== null &&
        this.user.selectedRole !== null &&
        this.user.selectedRole.type !== null &&
        this.user.selectedRole.type === type
      );
    },
    menuAction(route) {
      if (!this.isSelectedRoleValid()) {
        this.handleRedundantNavigation("login", null);
      } else if (route === "studentAddRequest") {
        this.selectedRequest = {
          problem: "",
          courseNum: "",
          description: "",
          status: "Received",
          personId: this.user.userID,
        };
        this.requestDialog = true;
      } else {
        this.handleRedundantNavigation(route, this.selectedRole.personRoleId);
      }
    },
    async resetMenu() {
      this.user = Utils.getStore("user");
      if (this.isUserPopulated()) {
        await this.goToPage(this.user.userID);
        if (this.openSelect) {
          if (this.isUserPopulated() && this.isSelectedRoleValid()) {
            this.activeMenus = this.menus;
            this.activeMenus = this.menus.filter((menu) =>
              menu.roles.includes(this.selectedRole.type)
            );
            if (this.selectedRole.type.includes("Student"))
              this.limitStudentMenu();
            else if (this.selectedRole.type.includes("Tutor"))
              this.limitTutorMenu();
            else if (this.selectedRole.type.includes("Admin"))
              this.limitAdminMenu();
          } else {
            this.activeMenus = this.menus.filter((menu) =>
              menu.roles.includes("None")
            );
          }
        }
      }
    },
    async logout() {
      await AuthServices.logoutUser(this.user).catch((error) => {
        console.log("error", error);
      });
      Utils.removeItem("user");
      this.handleRedundantNavigation("login", null);
    },
    async limitTutorMenu() {
      if (this.selectedRole.type.includes("Tutor")) {
        let approved = false;
        await PersonRoleServices.getPersonRole(this.selectedRole.personRoleId)
          .then((response) => {
            if (
              response.data.status.includes("approved") ||
              response.data.status.includes("Approved")
            ) {
              approved = true;
            }
          })
          .catch((error) => {
            console.log("There was an error:", error.response);
          });

        if (!approved) {
          // makes only tutor home page show up on menu bar
          this.activeMenus = this.activeMenus.filter((menu) =>
            menu.name.includes("home")
          );
        }
      }
    },
    async limitStudentMenu() {
      if (this.selectedRole.type.includes("Student")) {
        let approved = false;
        await PersonRoleServices.getPersonRole(this.selectedRole.personRoleId)
          .then((response) => {
            if (
              response.data.status.includes("approved") ||
              response.data.status.includes("Approved")
            ) {
              approved = true;
            }
          })
          .catch((error) => {
            console.log("There was an error:", error.response);
          });

        if (!approved) {
          // makes only student home page show up on menu bar
          this.activeMenus = this.activeMenus.filter((menu) =>
            menu.name.includes("home")
          );
        }
      }
    },
    async limitAdminMenu() {
      if (this.selectedRole.type.includes("Admin")) {
        let approved = false;
        await PersonRoleServices.getPersonRole(this.selectedRole.personRoleId)
          .then((response) => {
            if (
              response.data.status.includes("approved") ||
              response.data.status.includes("Approved")
            ) {
              approved = true;
            }
          })
          .catch((error) => {
            console.log("There was an error:", error.response);
          });

        if (!approved) {
          // makes only admin home page show up on menu bar
          this.activeMenus = this.activeMenus.filter((menu) =>
            menu.name.includes("adminHome")
          );
        }
      }
    },
    async checkPrivilege(privilege, personRolePrivileges) {
      let hasPriv = false;
      for (let i = 0; i < personRolePrivileges.length; i++) {
        let priv = personRolePrivileges[i];
        if (priv.privilege === privilege) hasPriv = true;
      }
      return hasPriv;
    },
    async addRequest(request) {
      let newRequest = {
        courseNum: request.courseNum,
        description: request.description,
        status: request.status,
        problem: request.problem,
        groupId: request.groupId,
        personId: request.personId,
        topicId: request.topicId,
      };
      await RequestServices.addRequest(newRequest)
        .then(async (response) => {
          let admins = [];
          await RoleServices.getAllForGroupByType(request.groupId, "Admin")
            .then((response) => {
              admins = response.data[0].personrole;
            })
            .catch((error) => {
              console.log("There was an error:", error.response);
            });
          for (let i = 0; i < admins.length; i++) {
            let tempA = admins[i];
            tempA.requestId = response.data.id;
            if (
              await this.checkPrivilege(
                "Receive notifications for requests",
                tempA.personroleprivilege
              )
            ) {
              let textInfo = {
                fromFirstName: this.user.fName,
                fromLastName: this.user.lName,
                adminPersonRoleId: tempA.id,
                requestId: response.data.id,
                adminPhoneNum: tempA.person.phoneNum,
                groupName: this.user.selectedGroup,
              };
              await TwilioServices.sendRequestMessage(textInfo);
            }
          }
          this.requestDialog = false;
        })
        .catch((error) => {
          console.log("There was an error:", error);
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
        });
    },
  },
};
</script>

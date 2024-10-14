<template>
  <div>
    <v-dialog
      v-if="user !== null"
      v-model="roleDialog"
      persistent
      max-width="800"
    >
      <v-card tile>
        <v-card-title>
          {{ user.fName }}, what best describes your situation right now?
        </v-card-title>
        <br />
        <v-card-text>
          <v-row align-center>
            <v-col class="d-flex justify-center align-center">
              <v-btn
                :color="roleSelect == 'Student' ? 'primary' : 'grey lighten-2'"
                x-large
                @click="roleSelect = 'Student'"
              >
                <v-icon class="mx-2">mdi-chair-school</v-icon> Student
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-center align-center">
              <v-btn
                :color="roleSelect == 'Tutor' ? 'primary' : 'grey lighten-2'"
                x-large
                @click="roleSelect = 'Tutor'"
              >
                <v-icon class="mx-2">mdi-human-male-board-poll</v-icon> Tutor
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-center align-center">
              I want tutoring in some of my classes.
            </v-col>
            <v-col class="d-flex justify-center align-center">
              I want to help provide quality tutoring to other students.
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey white--text"
            @click="$emit('closeRegistrationComponent')"
          >
            Cancel
          </v-btn>
          <v-btn
            color="accent"
            @click="
              roleDialog = false;
              groupDialog = true;
              haveRoleAlready();
            "
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="user !== null"
      v-model="groupDialog"
      persistent
      max-width="1000"
    >
      <v-card tile>
        <v-card-title>
          {{ user.fName }}, which group would you like to be a
          {{ roleSelect.toLowerCase() }} in?
        </v-card-title>
        <br />
        <v-card-text>
          <v-row>
            <v-col v-for="group in groups" :key="group.id">
              <v-card
                :disabled="group.haveRole"
                :color="groupSelect === group.id ? 'primary' : 'grey lighten-2'"
                height="200"
                elevation="10"
                v-on="
                  !group.haveRole
                    ? { click: () => (groupSelect = group.id) }
                    : {}
                "
              >
                <v-card-title
                  :class="
                    groupSelect === group.id ? 'white--text' : 'black--text'
                  "
                >
                  {{ group.name }}
                </v-card-title>
                <v-card-text
                  :class="
                    groupSelect === group.id ? 'white--text' : 'black--text'
                  "
                >
                  {{ group.description }}
                  <v-overlay
                    :absolute="absolute"
                    :opacity="opacity"
                    :value="group.haveRole"
                  >
                    <h3>
                      {{ group.sentenceHaveRole }}
                    </h3>
                  </v-overlay>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="accent"
            @click="
              roleDialog = true;
              groupDialog = false;
              groupSelect = '';
            "
          >
            Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="grey white--text"
            @click="$emit('closeRegistrationComponent')"
          >
            Cancel
          </v-btn>
          <v-btn
            color="accent"
            :disabled="groupSelect === ''"
            @click="savePersonRoles()"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <GroupViewComponent v-if="openSelect"></GroupViewComponent>
  </div>
</template>

<script>
import GroupServices from "@/services/groupServices";
import RoleServices from "@/services/roleServices";
import PersonRoleServices from "@/services/personRoleServices";
import TwilioServices from "@/services/twilioServices";
import Utils from "@/config/utils.js";
import GroupViewComponent from "./GroupViewComponent.vue";
import { RedirectToPageMixin } from "../mixins/RedirectToPageMixin";

export default {
  name: "RegistrationComponent",
  components: {
    GroupViewComponent,
  },
  mixins: [RedirectToPageMixin],
  data() {
    return {
      roleDialog: true,
      groupDialog: false,
      absolute: true,
      opacity: 0.75,
      roleSelect: "Student",
      groupSelect: "",
      groups: [],
      admins: [],
      person: {},
      roles: [],
      personrole: {},
      roleCounter: 0,
      user: {},
      hasAnyRoles: false,
    };
  },
  async created() {
    await this.getGroups();
    this.user = Utils.getStore("user");
    this.hasAnyRoles = this.user.access.length > 0;
  },
  methods: {
    async haveRoleAlready() {
      let groups = [];
      this.user.access.forEach((element) => {
        groups.push(element.name);
      });
      for (let k = 0; k < this.groups.length; k++) {
        this.groups[k].haveRole = false;
        this.groups[k].sentenceHaveRole = "";
        if (this.hasAnyRoles) {
          for (let i = 0; i < groups.length; i++) {
            if (groups[i].includes(this.groups[k].name)) {
              let role = "";
              this.user.access[i].roles.forEach((element) => {
                role += element.type;
              });
              if (role.includes(this.roleSelect)) {
                this.groups[k].haveRole = true;
                this.groups[k].sentenceHaveRole = "You already have this role.";
              }
            }
          }
        }
      }
    },
    async getGroups() {
      await GroupServices.getAllGroups()
        .then((response) => {
          this.groups = response.data;
          this.groups.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
        })
        .catch((error) => {
          console.log("There was an error:", error.response);
        });
    },
    async addGroupRoles(id) {
      await RoleServices.getAllForGroup(id)
        .then((response) => {
          response.data.forEach((data) => {
            this.roles.push(data);
          });
        })
        .catch((error) => {
          console.log("There was an error:", error.response);
        });
    },
    async savePersonRoles() {
      await this.addGroupRoles(this.groupSelect);

      for (let i = 0; i < this.roles.length; i++) {
        const role = this.roles[i];
        if (role.type === this.roleSelect) {
          this.personrole = {
            status:
              role.type.toLowerCase() === "student" ? "approved" : "applied",
            agree: role.type.toLowerCase() === "student" ? true : false,
            dateSigned: Date(),
            personId: this.user.userID,
            roleId: role.id,
          };
          await PersonRoleServices.addPersonRole(this.personrole)
            .then(async (response) => {
              let status = response.data.status;
              // send notification to admins if new person role is a tutor
              if (role.type.toLowerCase() === "tutor" && status === "applied") {
                await this.getAdmins(role.groupId);

                for (let i = 0; i < this.admins.length; i++) {
                  let tempA = this.admins[i];
                  tempA.personRoleId = response.data.id;
                  if (
                    await this.checkPrivilege(
                      "Receive notifications for applications",
                      tempA.personroleprivilege
                    )
                  ) {
                    let textInfo = {
                      fromFirstName: this.user.fName,
                      fromLastName: this.user.lName,
                      adminPersonRoleId: tempA.id,
                      applicationPersonRoleId: response.data.id,
                      adminPhoneNum: tempA.person.phoneNum,
                      groupName: this.groups.find(
                        (group) => group.id == role.groupId
                      ).name,
                    };
                    await TwilioServices.sendApplicationMessage(textInfo);
                  }
                }
              }
            })
            .catch((error) => {
              this.message = error;
              console.log("There was an error:", error);
            });
        }
      }

      this.setAccess();
    },
    async setAccess() {
      // reset the access after a new role is added to a person
      await GroupServices.getGroupsForPerson(this.user.userID)
        .then((response) => {
          this.user.access = [];
          for (let i = 0; i < response.data.length; i++) {
            let element = response.data[i];
            let roles = [];
            for (let j = 0; j < element.role.length; j++) {
              let item = element.role[j];
              let role = {
                type: item.type,
                personRoleId: item.personrole[0].id,
              };
              roles.push(role);
            }
            let group = {
              name: element.name,
              roles: roles,
            };
            this.user.access.push(group);
          }
          // resave user in store
          Utils.setStore("user", this.user);
          this.goToPage(this.user.userID);
        })
        .catch((error) => {
          console.log("There was an error:", error.response);
        });
    },
    async checkPrivilege(privilege, personroleprivileges) {
      let hasPriv = false;
      for (let i = 0; i < personroleprivileges.length; i++) {
        let priv = personroleprivileges[i];
        if (priv.privilege === privilege) hasPriv = true;
      }
      return hasPriv;
    },
    async getAdmins(groupId) {
      await RoleServices.getAllForGroupByType(groupId, "Admin")
        .then((response) => {
          this.admins = response.data[0].personrole;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
  },
};
</script>

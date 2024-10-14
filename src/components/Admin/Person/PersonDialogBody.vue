<template>
  <v-card>
    <v-card-title class="primary white--text mb-6">{{
      isEdit
        ? "Edit " + person.fName + " " + person.lName + " in " + group.name
        : "Add New Admin to " + group.name
    }}</v-card-title>
    <v-card-text>
      <v-text-field
        id="fName"
        required
        :value="person.fName"
        :counter="25"
        label="First Name"
        :rules="[(v) => !!v || 'This field is required']"
      ></v-text-field>

      <v-text-field
        id="lName"
        required
        :value="person.lName"
        :counter="25"
        label="Last Name"
        :rules="[(v) => !!v || 'This field is required']"
      ></v-text-field>

      <v-text-field
        id="email"
        required
        :value="person.email"
        :counter="50"
        label="Email"
        :rules="[
          (v) => !!v || 'This field is required',
          (v) =>
            /^\S+@\S+$/.test(v) || 'Must contain an @ followed by a domain',
          (v) =>
            (!!v && v.split('@').pop() === 'oc.edu') ||
            (!!v && v.split('@').pop() === 'eagles.oc.edu') ||
            'Must be a valid OC domain (oc.edu or eagles.oc.edu)',
        ]"
      ></v-text-field>

      <v-text-field
        id="phoneNum"
        required
        :value="person.phoneNum"
        :counter="10"
        label="Phone Number"
        :rules="[
          (v) => !!v || 'This field is required',
          (v) => (!!v && v.length >= 10) || 'Number too short',
          (v) => (!!v && v.length <= 10) || 'Number too long',
          (v) => /^[0-9]+$/.test(v) || 'Must contain only numbers',
        ]"
      ></v-text-field>

      <v-checkbox
        id="textOptIn"
        v-model="person.textOptIn"
        label="Text Opt In"
      ></v-checkbox>
    </v-card-text>

    <v-row v-if="isEdit" max-width="900px" class="mx-6 mb-4">
      <v-col cols="12" max-width="900px">
        <v-row max-width="900px">
          <v-col cols="12" max-width="900px">
            <v-card>
              <v-card-title>
                Roles
                <v-spacer></v-spacer>
                <v-btn color="accent" elevation="2" @click="addPersonRole">
                  Add
                </v-btn>
              </v-card-title>
              <v-data-table
                :headers="roleHeaders"
                :items="personroles"
                :items-per-page="50"
                hide-default-footer
                @click:row="openPersonRoleDialog"
              >
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row max-width="900px">
          <v-col :cols="tutor ? 6 : 12">
            <v-card class="mx-auto">
              <v-card-title>
                Additional Privileges
                <v-spacer></v-spacer>
                <v-btn color="accent" elevation="2" @click="addPersonPrivilege">
                  Add
                </v-btn>
              </v-card-title>
              <v-data-table
                :headers="privilegeHeaders"
                :items="personroleprivileges"
                :items-per-page="50"
                hide-default-footer
                @click:row="openPersonPrivilegeDialog"
              >
              </v-data-table>
            </v-card>
          </v-col>
          <v-col v-if="tutor" cols="6">
            <v-card class="mx-auto">
              <v-card-title>
                Topics
                <v-spacer></v-spacer>
                <v-btn color="accent" elevation="2" @click="addPersonTopic">
                  Add
                </v-btn>
              </v-card-title>
              <v-data-table
                :headers="topicHeaders"
                :items="persontopics"
                :items-per-page="50"
                hide-default-footer
                @click:row="openPersonTopicDialog"
              >
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="personRoleDialog" persistent max-width="600px">
      <PersonRoleDialogBody
        :sent-person-name="person.fName + ' ' + person.lName"
        :sent-person-role="selectedPersonRole"
        :sent-bool="isPersonRoleDialogEdit"
        :sent-group-roles="groupRoles"
        @closePersonRoleDialog="personRoleDialog = false"
        @saveOrAddPersonRole="saveOrAddPersonRole"
        @changePersonRoleStatus="changePersonRoleStatus"
      ></PersonRoleDialogBody>
    </v-dialog>

    <v-dialog v-model="personPrivilegeDialog" persistent max-width="600px">
      <PersonPrivilegeDialogBody
        :sent-person-name="person.fName"
        :sent-person-roles="personroles"
        :sent-person-privilege="selectedPersonPrivilege"
        :sent-bool="isPersonPrivilegeDialogEdit"
        @closePersonPrivilegeDialog="personPrivilegeDialog = false"
        @saveOrAddPersonRolePrivilege="saveOrAddPersonRolePrivilege"
        @deletePersonPrivilege="deletePersonPrivilege"
      ></PersonPrivilegeDialogBody>
    </v-dialog>

    <v-dialog v-model="personTopicDialog" persistent max-width="600px">
      <PersonTopicDialogBody
        :sent-person-name="person.fName"
        :sent-person-topic="selectedPersonTopic"
        :sent-bool="isPersonTopicDialogEdit"
        :sent-group-topics="groupTopics"
        @closePersonTopicDialog="personTopicDialog = false"
        @saveOrAddPersonTopic="saveOrAddPersonTopic"
        @deletePersonTopic="deletePersonTopic"
      ></PersonTopicDialogBody>
    </v-dialog>

    <v-card-actions class="pb-4">
      <v-spacer></v-spacer>
      <v-btn color="grey white--text" @click="$emit('closePersonDialog')">
        {{ isEdit ? "Discard Changes" : "Cancel" }}
      </v-btn>
      <v-btn color="accent" @click="saveOrAddPerson()">{{
        isEdit ? "Save Changes" : "Add Person"
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import RoleServices from "@/services/roleServices.js";
import TopicServices from "@/services/topicServices.js";
import PersonRoleDialogBody from "./PersonRoleDialogBody.vue";
import PersonPrivilegeDialogBody from "./PersonPrivilegeDialogBody.vue";
import PersonTopicDialogBody from "./PersonTopicDialogBody.vue";
import PersonRoleServices from "@/services/personRoleServices.js";
import AppointmentServices from "@/services/appointmentServices.js";
import PersonAppointmentServices from "@/services/personAppointmentServices.js";
import PersonRolePrivilegeServices from "@/services/personRolePrivilegeServices.js";
import PersonTopicServices from "@/services/personTopicServices.js";

export default {
  name: "PersonDialogBody",
  components: {
    PersonRoleDialogBody,
    PersonPrivilegeDialogBody,
    PersonTopicDialogBody,
  },
  props: {
    sentBool: { type: [Boolean], default: false },
    sentPerson: {
      type: [Object],
      default() {
        return {
          id: 1,
          fName: "",
          lName: "",
          email: "",
          phoneNum: "",
          textOptIn: 1,
        };
      },
    },
    sentGroup: {
      type: [Object],
      default() {
        return {
          id: 1,
          name: "",
          description: "",
        };
      },
    },
    sentGroupRoles: {
      type: [Array],
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      personRoleDialog: false,
      personPrivilegeDialog: false,
      personTopicDialog: false,
      selectedPersonRole: [],
      isPersonRoleDialogEdit: false,
      selectedPersonTopic: [],
      isPersonTopicDialogEdit: false,
      selectedPersonPrivilege: [],
      isPersonPrivilegeDialogEdit: false,
      person: this.sentPerson,
      tutor: false,
      group: this.sentGroup,
      groupRoles: this.sentGroupRoles,
      groupTopics: [],
      filteredGroupTopics: [],
      isEdit: this.sentBool,
      roleHeaders: [
        { text: "Type", value: "type" },
        { text: "Status", value: "personrole[0].status" },
      ],
      topicHeaders: [
        { text: "Name", value: "name" },
        { text: "Skill Level", value: "persontopic[0].skillLevel" },
      ],
      privilegeHeaders: [
        { text: "Privilege", value: "privilege" },
        { text: "Associated Role", value: "associatedRole" },
      ],
      personroles: [],
      personrole: {},
      appointments: [],
      personroleprivileges: [],
      personroleprivilege: {},
      persontopics: [],
      persontopic: {},
    };
  },
  watch: {
    async sentPerson(newPerson) {
      this.person = newPerson;
      await this.getPersonRoles();
      if (this.tutor) {
        await this.getPersonTopics();
        // this.filterGroupTopics();
      }
    },
    sentBool(newVal) {
      this.isEdit = newVal;
    },
    async sentGroup(newGroup) {
      this.group = newGroup;
      await this.getTopicsForGroup();
      // this.filterGroupTopics();
    },
    async sentGroupRoles(newRoles) {
      this.groupRoles = newRoles;
    },
  },
  async created() {
    if (this.sentPerson) {
      await this.getPersonRoles();
      if (this.tutor) {
        await this.getPersonTopics();
      }
    }
    await this.getTopicsForGroup();
  },
  methods: {
    openPersonRoleDialog(item) {
      this.selectedPersonRole = item.personrole[0];
      this.selectedPersonRole.type = item.type;
      this.isPersonRoleDialogEdit = true;
      this.personRoleDialog = true;
    },
    addPersonRole() {
      this.selectedPersonRole = {
        agree: true,
        personId: 0,
        personRolePrivilege: [],
        roleId: 0,
        status: "",
        type: "",
      };
      this.isPersonRoleDialogEdit = false;
      this.personRoleDialog = true;
    },
    openPersonTopicDialog(item) {
      this.selectedPersonTopic = item.persontopic[0];
      this.selectedPersonTopic.name = item.name;
      this.isPersonTopicDialogEdit = true;
      this.personTopicDialog = true;
    },
    addPersonTopic() {
      this.selectedPersonTopic = {
        skillLevel: "",
        topicId: 0,
        personId: 0,
      };
      this.isPersonTopicDialogEdit = false;
      this.personTopicDialog = true;
    },
    openPersonPrivilegeDialog(item) {
      this.selectedPersonPrivilege = item;
      this.isPersonPrivilegeDialogEdit = true;
      this.personPrivilegeDialog = true;
    },
    addPersonPrivilege() {
      this.selectedPersonPrivilege = {
        privilege: "",
        personRoleId: 0,
      };
      this.isPersonPrivilegeDialogEdit = false;
      this.personPrivilegeDialog = true;
    },
    // filterGroupTopics() {
    //   this.filteredGroupTopics = this.groupTopics.filter(function (topic) {
    //     return !this.persontopics.includes(topic);
    //   });
    // },
    saveOrAddPerson() {
      this.person.fName = document.getElementById("fName").value;
      this.person.lName = document.getElementById("lName").value;
      this.person.email = document.getElementById("email").value;
      this.person.phoneNum = document.getElementById("phoneNum").value;
      this.person.textOptIn =
        document.getElementById("textOptIn").checked === true ? 1 : 0;

      this.$emit("saveOrAddPerson", this.person, this.isEdit);
    },
    async getPersonRoles() {
      this.personroleprivileges = [];
      await RoleServices.getRoleByGroupForPerson(
        this.group.id,
        this.sentPerson.id
      )
        .then(async (response) => {
          this.personroles = response.data;
          for (let i = 0; i < this.personroles.length; i++) {
            let personRoleArray = this.personroles[i].personrole;
            // set tutor boolean
            if (this.personroles[i].type.includes("Tutor")) this.tutor = true;
            // set up personroleprivilege array
            for (let j = 0; j < personRoleArray.length; j++) {
              let pr = personRoleArray[j];
              for (let k = 0; k < pr.personroleprivilege.length; k++) {
                let priv = pr.personroleprivilege[k];
                priv.associatedRole = this.personroles[i].type;
                this.personroleprivileges.push(priv);
                // can't do what's below because multiple roles may need the same privilege
                // this.privileges = this.privileges.filter(privilege => privilege !== priv.privilege)
              }
            }
          }
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async getRolesForGroup() {
      await RoleServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.groupRoles = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async getTopicsForGroup() {
      await TopicServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.groupTopics = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async getPersonTopics() {
      await TopicServices.getTopicByGroupForPerson(
        this.group.id,
        this.person.id
      )
        .then((response) => {
          this.persontopics = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    rowClick: function (item, type) {
      if (type === "role") {
        this.openPersonRoleDialog(item, true);
      } else if (type === "topic") {
        this.openPersonTopicDialog(item, true);
      }
    },
    async saveOrAddPersonRole(personRole, isEdit) {
      delete personRole.updatedAt;

      if (isEdit) {
        await PersonRoleServices.updatePersonRole(personRole.id, personRole)
          .then(() => {
            this.personRoleDialog = false;
            this.getPersonRoles();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      } else {
        personRole.personId = this.person.id;
        personRole.agree = true;
        personRole.dateSigned = new Date();
        await PersonRoleServices.addPersonRole(personRole)
          .then(() => {
            this.personRoleDialog = false;
            this.getPersonRoles();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      }
    },
    async changePersonRoleStatus(role) {
      if (role.status === "disabled") {
        role.groupId = this.group.id;
        await PersonRoleServices.disablePersonRole(role)
          .then(() => {
            this.personRoleDialog = false;
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      } else if (role.status === "approved") {
        role.groupId = this.group.id;
        await PersonRoleServices.updatePersonRole(role.id, role)
          .then(() => {
            this.personRoleDialog = false;
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      }
      await this.getPersonRoles();
      await this.getPersonTopics();
    },
    async getAppointments() {
      await AppointmentServices.getUpcomingAppointmentForPersonForGroup(
        this.group.id,
        this.person.id
      )
        .then(async (response) => {
          this.appointments = response.data;
          for (let i = 0; i < this.appointments.length; i++) {
            await PersonAppointmentServices.findStudentDataForTable(
              this.appointments[i].id
            )
              .then((response) => {
                this.appointments[i].students = response.data;
              })
              .catch((error) => {
                this.message = error.response.data.message;
                console.log("There was an error:", error.response);
              });

            await PersonAppointmentServices.findTutorDataForTable(
              this.appointments[i].id
            )
              .then((response) => {
                this.appointments[i].tutors = response.data;
              })
              .catch((error) => {
                this.message = error.response.data.message;
                console.log("There was an error:", error.response);
              });
          }
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async saveOrAddPersonRolePrivilege(privilege, isEdit) {
      if (isEdit) {
        await PersonRolePrivilegeServices.updatePrivilege(
          privilege.id,
          privilege
        )
          .then(() => {
            this.personPrivilegeDialog = false;
            this.getPersonRoles();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      } else {
        await PersonRolePrivilegeServices.addPrivilege(privilege)
          .then(() => {
            this.personPrivilegeDialog = false;
            this.getPersonRoles();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      }
    },
    async saveOrAddPersonTopic(personTopic, isEdit) {
      delete personTopic.updatedAt;
      if (isEdit) {
        await PersonTopicServices.updatePersonTopic(personTopic.id, personTopic)
          .then(() => {
            this.personTopicDialog = false;
            this.getPersonTopics();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log(error);
          });
      } else {
        personTopic.personId = this.person.id;
        await PersonTopicServices.addPersonTopic(personTopic)
          .then(() => {
            this.personTopicDialog = false;
            this.getPersonTopics();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      }
    },
    async deletePersonTopic(personTopic) {
      await PersonTopicServices.deletePersonTopic(personTopic.id)
        .then(() => {
          this.personTopicDialog = false;
          this.getPersonTopics();
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async deletePersonPrivilege(personPrivilege) {
      await PersonRolePrivilegeServices.deletePrivilege(personPrivilege.id)
        .then(() => {
          this.personPrivilegeDialog = false;
          this.getPersonRoles();
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
  },
};
</script>

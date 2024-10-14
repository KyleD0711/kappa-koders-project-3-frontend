<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ message }}</v-toolbar-title>
        <InformationComponent
          message="Make changes to your phone number or text opt in, or view your information below."
        ></InformationComponent>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{ user.selectedRole.type }}</v-toolbar-title>
      </v-toolbar>
      <br />

      <v-alert v-model="showAlert" dismissible :type="alertType">{{
        alert
      }}</v-alert>

      <v-text-field v-model="fullName" label="Name" readonly></v-text-field>

      <v-text-field
        v-model="person.email"
        label="Email"
        readonly
      ></v-text-field>

      <br />

      <PhoneNumberComponent
        :phone-num="person.phoneNum"
        @editedPhoneNumber="setPhoneNumber"
      ></PhoneNumberComponent>

      <v-checkbox
        v-model="person.textOptIn"
        label="Text Opt In"
        @change="enableUpdate = true"
      ></v-checkbox>

      <br />
      <v-btn
        :disabled="!enableUpdate"
        color="accent"
        class="justify-center white--text"
        @click="saveChanges()"
      >
        Update
      </v-btn>

      <br /><br />

      <v-card v-if="user.selectedRole.type === 'Tutor'">
        <v-card-title>
          Current Topics for {{ user.selectedGroup }}
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          :headers="topicHeaders"
          :items="topics"
          :items-per-page="50"
        ></v-data-table>
      </v-card>

      <br />

      <v-card
        v-if="
          user.selectedRole.type === 'Tutor' ||
          user.selectedRole.type === 'Admin'
        "
      >
        <v-card-title>
          Current Privileges for {{ user.selectedGroup }}
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          :headers="privilegeHeaders"
          :items="personroleprivileges"
          :items-per-page="50"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import PersonServices from "@/services/personServices";
import PersonRoleServices from "@/services/personRoleServices";
import RoleServices from "@/services/roleServices";
import TopicServices from "@/services/topicServices";
import Utils from "@/config/utils.js";
import InformationComponent from "../components/InformationComponent.vue";
import PhoneNumberComponent from "../components/PhoneNumberComponent.vue";

export default {
  name: "MyInfo",
  components: { InformationComponent, PhoneNumberComponent },
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      user: {},
      alertType: "success",
      alert: "",
      showAlert: false,
      person: {},
      group: {},
      enableUpdate: true,
      fullName: "",
      message: "",
      topics: [],
      personroles: [],
      personroleprivileges: [],
      newPhoneNumber: "",
      topicHeaders: [
        { text: "Topic", value: "name" },
        { text: "Skill Level", value: "persontopic[0].skillLevel" },
      ],
      privilegeHeaders: [
        { text: "Privilege", value: "privilege" },
        { text: "Associated Role", value: "associatedRole" },
      ],
    };
  },
  async created() {
    this.user = Utils.getStore("user");
    await this.getPerson();
    await this.getGroupByPersonRoleId();
    if (this.user.selectedRole.type === "Tutor") {
      await this.getTopics();
    }
    if (
      this.user.selectedRole.type === "Tutor" ||
      this.user.selectedRole.type === "Admin"
    ) {
      await this.getPersonRoles();
    }
  },
  methods: {
    async getPerson() {
      await PersonServices.getPerson(this.user.userID)
        .then((response) => {
          this.person = response.data;
          this.fullName = this.person.fName + " " + this.person.lName;
          this.message = this.fullName + "'s Information";
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    checkPhoneNumber(phoneNumber) {
      if (phoneNumber.length != 10) return false;
      else if (/^\d+$/.test(phoneNumber)) return true;
      else return false;
    },
    setPhoneNumber(phoneNumber) {
      this.newPhoneNumber = phoneNumber;
      if (this.checkPhoneNumber(phoneNumber)) this.enableUpdate = true;
      else this.enableUpdate = false;
    },

    async saveChanges() {
      this.person.phoneNum = this.newPhoneNumber;
      await PersonServices.updatePerson(this.person.id, this.person)
        .then(() => {
          this.alert =
            "Your phone number or text opt in was successfully updated.";
          this.enableUpdate = false;
          this.showAlert = true;
        })
        .catch((error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.enableUpdate = false;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    async getTopics() {
      await TopicServices.getTopicByGroupForPerson(
        this.group.id,
        this.user.userID
      )
        .then((response) => {
          this.topics = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async getGroupByPersonRoleId() {
      await PersonRoleServices.getGroupForPersonRole(this.id)
        .then(async (response) => {
          this.group = response.data[0].role.group;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async getPersonRoles() {
      this.personroleprivileges = [];
      await RoleServices.getRoleByGroupForPerson(
        this.group.id,
        this.user.userID
      )
        .then((response) => {
          this.personroles = response.data;
          for (let i = 0; i < this.personroles.length; i++) {
            let personRoleArray = this.personroles[i].personrole;
            // set up personroleprivilege array
            for (let j = 0; j < personRoleArray.length; j++) {
              let pr = personRoleArray[j];
              for (let k = 0; k < pr.personroleprivilege.length; k++) {
                let priv = pr.personroleprivilege[k];
                priv.associatedRole = this.personroles[i].type;
                this.personroleprivileges.push(priv);
              }
            }
          }
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
  },
};
</script>

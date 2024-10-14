<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>{{ message }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <InformationComponent
          message="Before continuing to this service, you must sign contracts for the
            following positions.
  
            Please click on each title to sign its contract."
        ></InformationComponent>
      </v-toolbar>
      <br />
      <v-alert v-model="showAlert" dismissible :type="alertType">{{
        alert
      }}</v-alert>
      <v-row justify="center">
        <v-col v-for="role in roles" :key="role.id">
          <v-card
            class="mx-auto my-12 d-flex justify-center"
            max-width="400"
            height="100"
            elevation="10"
            :style="{ 'background-color': role.color }"
            @click="role.dialog = true"
          >
            <v-card-title class="justify-center white--text">
              {{ role.type }} - {{ role.groupName }}
            </v-card-title>
          </v-card>

          <v-dialog v-model="role.dialog" persistent max-width="1000px">
            <v-card>
              <v-card-title>
                <span class="text-h5"
                  >Sign a contract for {{ role.groupName }}:</span
                >
              </v-card-title>
              <vue-pdf-embed :source="role.pdfName"></vue-pdf-embed>
              <v-container>
                <v-text-field
                  v-model="signature"
                  label="Digital Signature"
                  :hint="user.fullName"
                  persistent-hint
                  @keyup.enter="
                    role.dialog = false;
                    save(role);
                  "
                ></v-text-field>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  text
                  :disabled="!signature || signature !== user.fullName"
                  @click="
                    role.dialog = false;
                    signature = '';
                    save(role);
                  "
                >
                  Agree
                </v-btn>
              </v-card-actions>
              <br />
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>

      <GroupViewComponent v-if="openSelect"></GroupViewComponent>
    </v-container>
  </div>
</template>

<script>
import VuePdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed";
import GroupServices from "@/services/groupServices.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import Utils from "@/config/utils.js";
import GroupViewComponent from "@/components/GroupViewComponent.vue";
import InformationComponent from "@/components/InformationComponent.vue";
import { RedirectToPageMixin } from "../mixins/RedirectToPageMixin";

export default {
  name: "Contract",
  components: {
    VuePdfEmbed,
    GroupViewComponent,
    InformationComponent,
  },
  mixins: [RedirectToPageMixin],
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      showAlert: false,
      alert: "",
      alertType: "success",
      message: "Sign Contract",
      openSelect: false,
      roles: [],
      signature: "",
      numPages: 2,
      colors: [
        "#47121D",
        "#EE5044",
        "#63BAC0",
        "#196CA2",
        "#F8C545",
        "#032F45",
      ],
      user: {},
      files: [
        {
          pdf: process.env.VUE_APP_CLIENT_URL + "/NewCollege-Student.pdf",
          pages: 1,
        },
        {
          pdf:
            process.env.VUE_APP_CLIENT_URL +
            "/StudentSuccessCenter-Student.pdf",
          pages: 1,
        },
        {
          pdf: process.env.VUE_APP_CLIENT_URL + "/WritingCenter-Student.pdf",
          pages: 1,
        },
        {
          pdf: process.env.VUE_APP_CLIENT_URL + "/NewCollege-Tutor.pdf",
          pages: 1,
        },
        {
          pdf:
            process.env.VUE_APP_CLIENT_URL + "/StudentSuccessCenter-Tutor.pdf",
          pages: 1,
        },
        {
          pdf: process.env.VUE_APP_CLIENT_URL + "/WritingCenter-Tutor.pdf",
          pages: 2,
        },
      ],
      studentContracts: [
        "NewCollege-Student.pdf",
        "StudentSuccessCenter-Student.pdf",
        "WritingCenter-Student.pdf",
      ],
      tutorContracts: [
        "NewCollege-Tutor.pdf",
        "StudentSuccessCenter-Tutor.pdf",
        "WritingCenter-Tutor.pdf",
      ],
    };
  },
  async created() {
    this.user = Utils.getStore("user");
    this.user.fullName = this.user.fName + " " + this.user.lName;
    await this.setContracts();
  },
  methods: {
    // check that if there are multiple contracts to sign, some of the buttons go away
    async save(role) {
      await this.updatePersonRole(role);
      await this.goToPage(this.user.userID);
    },
    async setContracts() {
      this.roles = [];
      await GroupServices.getContractsNeededForPerson(this.user.userID)
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            let group = response.data[i];
            for (let j = 0; j < group.role.length; j++) {
              let role = group.role[j];
              console.log(role);
              for (let k = 0; k < role.personrole.length; k++) {
                let personrole = role.personrole[k];
                let tempFile = this.files.filter(function (file) {
                  console.log(group.name.replace(/\s/g, ""));
                  return (
                    file.pdf.includes(group.name.replace(/\s/g, "")) &&
                    file.pdf.includes(role.type.toString())
                  );
                });
                console.log(tempFile);
                personrole.pdfName = tempFile[0].pdf;
                personrole.numPages = tempFile[0].pages;
                personrole.groupName = group.name;
                personrole.dialog = false;
                personrole.signature = null;
                personrole.color = this.colors[k % this.colors.length];
                personrole.type = role.type;
                this.roles.push(personrole);
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        });
    },
    async updatePersonRole(role) {
      let updatedRole = {};
      if (role.type.includes("Student")) updatedRole.status = "approved";
      updatedRole.agree = true;
      updatedRole.dateSigned = Date();
      updatedRole.id = role.id;
      updatedRole.personId = role.personId;
      updatedRole.roleId = role.roleId;
      updatedRole.createdAt = role.createdAt;
      updatedRole.updatedAt = role.updatedAt;
      await PersonRoleServices.updatePersonRole(role.id, updatedRole).catch(
        (error) => {
          this.alertType = "error";
          this.alert = error.response.data.message;
          this.showAlert = true;
          console.log("There was an error:", error.response);
        }
      );
    },
  },
};
</script>

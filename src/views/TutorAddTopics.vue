<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>{{ message }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <InformationComponent
        message="Click on topics that you can tutor in. You will then need to specify your skill level on each."
      ></InformationComponent>
    </v-toolbar>
    <br />
    <v-alert v-model="showAlert" dismissible :type="alertType">{{
      alert
    }}</v-alert>
    <v-btn
      right
      color="accent"
      class="justify-center white--text"
      @click="
        dialog = true;
        getSelectedGroupTopics();
      "
    >
      Continue
    </v-btn>
    <br />
    <br />
    <v-item-group
      v-for="group in groups"
      :key="group.id"
      v-model="group.selected"
      multiple
    >
      <h3>{{ group.name }}</h3>
      <v-row justify="center">
        <v-col v-for="topic in group.grouptopics" :key="topic.id" md="4">
          <v-item v-slot="{ active, toggle }">
            <v-card
              class="mx-auto my-12 d-flex justify-center"
              max-width="400"
              height="100"
              elevation="10"
              :style="{ 'background-color': topic.color }"
              @click="toggle()"
            >
              <v-card-title class="justify-center white--text">
                {{ topic.name }}
              </v-card-title>
              <v-icon class="white--text">
                {{ active ? "mdi-check-bold" : "" }}
              </v-icon>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
    <br /><br />

    <v-dialog v-model="dialog" max-width="800">
      <v-card
        v-for="group in selectedGroupTopics"
        :key="group.id"
        flat
        rounded="0"
      >
        <v-card-title>
          <span class="text-h5"
            >Select your skill level for {{ group.name }} topics:</span
          >
        </v-card-title>
        <br />
        <v-card-text v-for="topic in group.selectedTopics" :key="topic.id">
          <h3>{{ topic.name }}</h3>
          <v-select
            v-model="topic.skillLevel"
            :items="levels"
            item-text="name"
            item-value="id"
            label="Skill Level"
            required
          >
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="accent"
            text
            @click="
              savePersonTopics();
              goToPage(user.userID);
            "
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <GroupViewComponent v-if="openSelect"></GroupViewComponent>
  </v-container>
</template>

<script>
import Utils from "@/config/utils.js";
import TopicServices from "@/services/topicServices";
import PersonTopicServices from "@/services/personTopicServices";
import InformationComponent from "../components/InformationComponent.vue";
import GroupViewComponent from "@/components/GroupViewComponent.vue";
import { RedirectToPageMixin } from "@/mixins/RedirectToPageMixin";

export default {
  name: "TutorAddTopics",
  components: {
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
  data: () => ({
    showAlert: false,
    alert: "",
    alertType: "success",
    selectedGroupTopics: [],
    groups: [],
    persontopic: {},
    user: {},
    colors: ["#47121D", "#EE5044", "#63BAC0", "#196CA2", "#F8C545", "#032F45"],
    dialog: false,
    levels: ["Freshman", "Sophomore", "Junior", "Senior"],
    message: "Add Topics",
  }),
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupsWithNoTopics();
    await this.getGroupTopics();
  },
  methods: {
    async getGroupsWithNoTopics() {
      await this.getPersonRoles(this.user.userID);
      this.groups = this.topicRoles;
      if (this.groups.length === 0) {
        this.goToPage(this.user.userID);
      } else {
        this.groups = this.groups.filter((group) => group.topic.length === 0);
      }
    },
    async getGroupTopics() {
      for (let i = 0; i < this.groups.length; i++) {
        let group = this.groups[i];
        this.groups[i].selected = [];
        this.groups[i].grouptopics = [];
        await TopicServices.getActiveForGroup(group.id)
          .then((response) => {
            for (let j = 0; j < response.data.length; j++) {
              let topic = response.data[j];
              topic.color =
                this.colors[Math.floor(Math.random() * this.colors.length)];
              this.groups[i].grouptopics.push(topic);
            }
          })
          .catch((error) => {
            this.alertType = "error";
            this.alert = error.response.data.message;
            this.showAlert = true;
            console.log("There was an error:", error.response);
          });
      }
      // doing this to ensure all topics show up
      this.$forceUpdate();
    },
    getSelectedGroupTopics() {
      for (let k = 0; k < this.groups.length; k++) {
        for (let i = 0; i < this.groups[k].grouptopics.length; i++) {
          for (let j = 0; j < this.groups[k].selected.length; j++) {
            if (this.groups[k].selected[j] === i) {
              if (!this.selectedGroupTopics.includes(this.groups[k])) {
                this.selectedGroupTopics.push(this.groups[k]);
              }
            }
          }
        }
      }

      for (let k = 0; k < this.selectedGroupTopics.length; k++) {
        this.selectedGroupTopics[k].selectedTopics = [];
        for (
          let i = 0;
          i < this.selectedGroupTopics[k].grouptopics.length;
          i++
        ) {
          for (
            let j = 0;
            j < this.selectedGroupTopics[k].selected.length;
            j++
          ) {
            if (this.selectedGroupTopics[k].selected[j] === i) {
              this.selectedGroupTopics[k].selectedTopics.push(
                this.selectedGroupTopics[k].grouptopics[i]
              );
            }
          }
        }
      }
    },
    async savePersonTopics() {
      for (let i = 0; i < this.selectedGroupTopics.length; i++) {
        for (
          let j = 0;
          j < this.selectedGroupTopics[i].selectedTopics.length;
          j++
        ) {
          let topic = this.selectedGroupTopics[i].selectedTopics[j];
          this.persontopic = {
            skillLevel: topic.skillLevel,
            topicId: topic.id,
            personId: this.user.userID,
          };
          await PersonTopicServices.addPersonTopic(this.persontopic).catch(
            (error) => {
              this.alertType = "error";
              this.alert = error.response.data.message;
              this.showAlert = true;
              console.log("There was an error:", error.response);
            }
          );
        }
      }
    },
  },
};
</script>

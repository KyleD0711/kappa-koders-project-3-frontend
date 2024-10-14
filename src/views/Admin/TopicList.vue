<template>
  <div>
    <v-container>
      <v-card-title class="text-h4 font-weight-bold pt-4 pb-6 pl-0 accent--text"
        >{{ `${user.selectedGroup} Topics` }}
        <InformationComponent
          :message="'View, edit and add topics for ' + group.name + '.'"
        ></InformationComponent
      ></v-card-title>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="accent" class="mr-4" elevation="2" @click="addTopic">
            Add
          </v-btn>
        </v-card-title>
        <v-dialog v-model="topicDialog" persistent max-width="800px">
          <TopicDialogBody
            :sent-topic="selectedTopic"
            :sent-bool="isTopicDialogEdit"
            @closeTopicDialog="topicDialog = false"
            @saveOrAddTopic="saveOrAddTopic"
            @changeTopicStatus="changeTopicStatus"
          ></TopicDialogBody>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="topics"
          :items-per-page="50"
          @click:row="rowClick"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Utils from "@/config/utils.js";
import PersonRoleServices from "@/services/personRoleServices.js";
import TopicServices from "@/services/topicServices.js";
import TopicDialogBody from "../../components/Admin/TopicDialogBody.vue";
import InformationComponent from "../../components/InformationComponent.vue";

export default {
  name: "TopicList",
  components: { TopicDialogBody, InformationComponent },
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      topicDialog: false,
      isTopicDialogEdit: true,
      selectedTopic: {},
      search: "",
      topics: [],
      user: {},
      group: {},
      headers: [
        { text: "Name", value: "name" },
        { text: "Abbreviation", value: "abbr" },
        { text: "Status", value: "status" },
      ],
      message: "",
    };
  },
  async created() {
    this.user = Utils.getStore("user");
    await this.getGroupByPersonRoleId();
    await this.getTopicsForGroup();
  },
  methods: {
    async getGroupByPersonRoleId() {
      await PersonRoleServices.getGroupForPersonRole(this.id)
        .then((response) => {
          this.group = response.data[0].role.group;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async getTopicsForGroup() {
      await TopicServices.getAllForGroup(this.group.id)
        .then((response) => {
          this.topics = response.data;
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    async changeTopicStatus(topic) {
      await TopicServices.updateTopic(topic.id, topic)
        .then(async () => {
          this.topicDialog = false;
          await this.getTopicsForGroup();
        })
        .catch((error) => {
          this.message = error.response.data.message;
          console.log("There was an error:", error.response);
        });
    },
    // Commenting this out for now - we need to create a DB query to check if a topic
    // is related to any other data. If not, we can let them delete it.
    // async deleteTopic() {
    //   let id = this.selectedTopic.id;
    //   let name = this.selectedTopic.name;
    //   let confirmed = confirm(`Are you sure you want to delete ${name}`);
    //   if (confirmed) {
    //     await TopicServices.deleteTopic(id)
    //       .then(async () => {
    //         this.topicDialog = false;
    //         await this.getTopicsForGroup();
    //       })
    //       .catch((error) => {
    //         this.message = error.response.data.message;
    //         console.log("There was an error:", error.response);
    //       });
    //   }
    // },
    rowClick: function (item) {
      this.isTopicDialogEdit = true;
      this.selectedTopic = item;
      this.topicDialog = true;
    },
    addTopic() {
      this.selectedTopic = {
        name: "",
        abbr: "",
        status: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: this.group.id,
      };
      this.isTopicDialogEdit = false;
      this.topicDialog = true;
    },
    async saveOrAddTopic(topic, isEdit) {
      topic.groupId = this.group.id;
      if (isEdit) {
        await TopicServices.updateTopic(topic.id, topic)
          .then(async () => {
            this.topicDialog = false;
            await this.getTopicsForGroup();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log("There was an error:", error.response);
          });
      } else {
        await TopicServices.addTopic(topic)
          .then(async () => {
            this.topicDialog = false;
            await this.getTopicsForGroup();
          })
          .catch((error) => {
            this.message = error.response.data.message;
            console.log(error);
          });
      }
    },
  },
};
</script>

<template>
  <v-card>
    <v-card-title class="primary white--text mb-6 headline">{{
      isEdit ? `Edit Topic - ${topic.name}` : "Add A New Topic"
    }}</v-card-title>
    <v-card-text>
      <v-text-field
        id="name"
        :value="topic.name"
        :counter="50"
        label="Name"
      ></v-text-field>

      <v-text-field
        id="abbr"
        :value="topic.abbr"
        :counter="25"
        label="Abbreviation"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="isEdit"
        color="error"
        @click="
          isDisabled
            ? changeTopicStatus('active')
            : (disableConfirmDialog = true)
        "
        >{{ isDisabled ? "Enable Topic" : "Disable Topic" }}</v-btn
      >
      <v-btn color="grey white--text" @click="$emit('closeTopicDialog')">
        {{ isEdit ? "Discard Changes" : "Cancel" }}
      </v-btn>
      <v-btn color="accent" @click="saveOrAddTopic()">{{
        isEdit ? "Save Changes" : "Add Topic"
      }}</v-btn>
    </v-card-actions>

    <v-dialog v-model="disableConfirmDialog" persistent max-width="750px">
      <DeleteConfirmationComponent
        type="topic"
        :item="topic"
        @handleReturningCancel="disableConfirmDialog = false"
        @handleReturningSuccess="
          isDisabled
            ? changeTopicStatus('active')
            : changeTopicStatus('disabled')
        "
      ></DeleteConfirmationComponent>
    </v-dialog>
  </v-card>
</template>

<script>
import DeleteConfirmationComponent from "../DeleteConfirmationComponent.vue";
export default {
  name: "TopicDialogBody",
  components: {
    DeleteConfirmationComponent,
  },
  props: {
    sentBool: { type: [Boolean], default: false },
    sentTopic: {
      type: [Object],
      default() {
        return {
          name: "",
          abbr: "",
          status: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          groupId: 1,
        };
      },
    },
  },
  data() {
    return {
      statuses: ["active", "disabled"],
      topic: this.sentTopic,
      isEdit: this.sentBool,
      isDisabled: this.sentTopic.status === "disabled" ? true : false,
      disableConfirmDialog: false,
    };
  },
  watch: {
    sentTopic(newTopic) {
      this.topic = newTopic;
      this.isDisabled = this.topic.status === "disabled" ? true : false;
    },
    sentBool(newVal) {
      this.isEdit = newVal;
    },
  },
  created() {},
  methods: {
    saveOrAddTopic() {
      this.topic.name = document.getElementById("name").value;
      this.topic.abbr = document.getElementById("abbr").value;

      if (this.isEdit) {
        this.topic.updatedAt = new Date();
      }

      this.$emit("saveOrAddTopic", this.topic, this.isEdit);
    },
    changeTopicStatus(status) {
      this.topic.status = status;
      this.isDisabled = !this.isDisabled;
      this.$emit("changeTopicStatus", this.topic);
    },
  },
};
</script>

<template>
  <v-card>
    <v-card-title class="primary white--text mb-6">{{
      isEdit
        ? "Edit " + personTopic.name + " Topic for " + personName
        : "Add a Topic for " + personName
    }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-if="isEdit"
        id="topic"
        :value="selectedTopic.name"
        disabled
        label="Topic"
      ></v-text-field>
      <v-select
        v-if="!isEdit"
        id="topic"
        v-model="selectedTopic"
        :items="groupTopics"
        item-text="name"
        item-value="id"
        return-object
        label="Topics"
      ></v-select>
      <v-select
        id="skillLevel"
        v-model="selectedSkillLevel"
        :items="skillLevels"
        return-object
        label="Skill Level"
      ></v-select>
    </v-card-text>

    <v-card-actions class="pb-4">
      <v-spacer></v-spacer>
      <v-btn
        v-if="isEdit"
        color="error white--text"
        @click="$emit('deletePersonTopic', personTopic)"
      >
        {{ "Delete Topic" }}
      </v-btn>
      <v-btn color="grey white--text" @click="$emit('closePersonTopicDialog')">
        {{ isEdit ? "Discard Changes" : "Cancel" }}
      </v-btn>
      <v-btn color="accent" @click="saveOrAddPersonTopic()">{{
        isEdit ? "Save Changes" : "Add Topic"
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "PersonTopicDialogBody",
  components: {},
  props: {
    sentBool: { type: [Boolean], default: false },
    sentPersonTopic: {
      type: [Object],
      default() {
        return {
          skillLevel: "",
          topicId: 0,
          personId: 0,
        };
      },
    },
    sentPersonName: {
      type: [String],
      default: "test",
    },
    sentGroupTopics: {
      type: [Array],
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      personName: this.sentPersonName,
      personTopic: this.sentPersonTopic,
      personTopicSkillLevel: this.sentPersonTopic.skillLevel,
      groupTopics: this.sentGroupTopics,
      isEdit: this.sentBool,
      skillLevels: ["Freshman", "Sophomore", "Junior", "Senior"],
      selectedTopic: {
        id: this.sentPersonTopic.topicId,
        name: this.sentPersonTopic.name,
      },
      selectedSkillLevel: this.sentPersonTopic.skillLevel,
    };
  },
  watch: {
    sentPersonName(newPersonName) {
      this.personName = newPersonName;
    },
    sentPersonTopic(newTopic) {
      this.personTopic = newTopic;
      this.personTopicSkillLevel = newTopic.skillLevel;
      this.selectedTopic = {
        id: this.sentPersonTopic.topicId,
        name: this.sentPersonTopic.name,
      };
      this.selectedSkillLevel = this.sentPersonTopic.skillLevel;
    },
    sentBool(newVal) {
      this.isEdit = newVal;
    },
    sentGroupTopics(newGroupTopics) {
      this.groupTopics = newGroupTopics;
      this.removeSelectedTopic();
    },
  },
  methods: {
    saveOrAddPersonTopic() {
      this.personTopic.skillLevel = this.selectedSkillLevel;
      if (!this.isEdit) {
        this.personTopic.topicId = this.selectedTopic.id;
      }

      this.$emit("saveOrAddPersonTopic", this.personTopic, this.isEdit);
    },
    removeSelectedTopic() {
      this.groupTopics = this.groupTopics.filter(
        (g) => g.id !== this.personTopic.id
      );
    },
  },
};
</script>

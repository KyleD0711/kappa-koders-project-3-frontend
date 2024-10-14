<template>
  <div>
    <div class="text-caption">Phone Number</div>

    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model="phoneNum1"
          hint="405"
          :rules="[rules.required, rules.numbersOnly, rules.counter3]"
          maxlength="3"
          persistent-hint
          outlined
          dense
          @input="setNewPhoneNumber()"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="phoneNum2"
          hint="425"
          maxlength="3"
          persistent-hint
          outlined
          dense
          :rules="[rules.required, rules.numbersOnly, rules.counter3]"
          @input="setNewPhoneNumber()"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="phoneNum3"
          hint="5555"
          maxlength="4"
          persistent-hint
          outlined
          dense
          :rules="[rules.required, rules.numbersOnly, rules.counter4]"
          @input="setNewPhoneNumber()"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "PhoneNumberComponent",
  props: {
    phoneNum: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      phoneNum1: "",
      phoneNum2: "",
      phoneNum3: "",
      newPhoneNumber: "",
      rules: {
        required: (value) => !!value || "Required.",
        counter3: (value) => value.length == 3 || "Must be ###",
        counter4: (value) => value.length == 4 || "Must be ####",
        numbersOnly: (value) => /^\d+$/.test(value) || "Number only",
      },
    };
  },
  watch: {
    phoneNum(newPhoneNum, oldPhoneNum) {
      if (newPhoneNum !== oldPhoneNum) {
        this.splitPhoneNumber();
      }
    },
  },
  created() {
    this.splitPhoneNumber();
  },
  methods: {
    splitPhoneNumber() {
      if (
        this.phoneNum !== undefined &&
        this.phoneNum !== null &&
        this.phoneNum !== ""
      ) {
        this.phoneNum1 = this.phoneNum.substring(0, 3);
        this.phoneNum2 = this.phoneNum.substring(3, 6);
        this.phoneNum3 = this.phoneNum.substring(6, 10);
      }
    },
    setNewPhoneNumber() {
      this.newPhoneNumber = this.phoneNum1 + this.phoneNum2 + this.phoneNum3;

      this.$emit("editedPhoneNumber", this.newPhoneNumber);
    },
  },
};
</script>

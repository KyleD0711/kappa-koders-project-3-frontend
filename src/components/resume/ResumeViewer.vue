<script setup>
import { onMounted, ref } from "vue";
import htmlGenerator from "../../../templates/htmlGenerator";

const innerHtml = ref(null);

const props = defineProps({
  education: {
    type: Array,
    required: true,
  },
  experience: {
    type: Array,
    required: true,
  },
});

let user = {
  fName: "Kyle",
  lName: "Denney",
};

let personal_info = "";

const professional_summary = "Cool stuff is going on";

let education = {
  institution: "",
  credential_earned: "",
  date_to: "",
  date_from: "",
  gpa: "",
  coursework: null,
};

const template2 = [
  {
    section_name: "pdf_header",
    style: {},
    content: "",
    children: [
      {
        section_name: "name",
        style: {
          "text-align": "center",
          "font-size": "2em",
          "font-weight": "bold",
          "margin-top": "0.67em",
          "margin-bottom": "0.67em",
          "line-height": "1.2",
        },
        content: `${user.fName} ${user.lName}`,
        children: [],
      },
      {
        section_name: "personal_info",
        style: {
          "text-align": "center",
        },
        content: personal_info,
        children: [],
      },
    ],
  },
  {
    section_name: "professional_summary",
    style: {},
    content: "",
    children: [
      {
        section_name: "section_header",
        style: {
          "font-weight": "bold",
          "margin-bottom": "5px",
        },
        content: "PROFESSIONAL SUMMARY",
        children: [],
      },
      {
        section_name: "divider",
      },
      {
        section_name: "section_body",
        style: {},
        content: professional_summary,
      },
    ],
  },
];

const template = {
  section_name: "pdf_body",
  style: {
    "background-color": "white",
    margin: "50px 150px",
    padding: "10px 10px",
    "border-radius": "10px",
  },
  content: "",
  children: [
    {
      section_name: "pdf_header",
      style: {},
      content: "",
      children: [
        {
          section_name: "name",
          style: {
            "text-align": "center",
            "font-size": "2em",
            "font-weight": "bold",
            "margin-top": "0.67em",
            "margin-bottom": "0.67em",
            "line-height": "1.2",
          },
          content: "First Name Last Name",
          children: [],
        },
        {
          section_name: "personal_info",
          style: {
            "text-align": "center",
          },
          content:
            "Oklahoma City, Oklahoma | (555) 555-5555 | ike.theagle@oc.edu | LinkedIn/Website URL (optional)",
          children: [],
        },
      ],
    },
  ],
};

onMounted(() => {
  innerHtml.value = htmlGenerator.generateHTMLFromTemplate(template2);
  // console.log(htmlGenerator.parseHTMLToJSON(htmlFile));
});
</script>
<template>
  <div v-html="innerHtml"></div>
</template>

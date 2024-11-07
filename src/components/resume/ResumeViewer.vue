<script setup>
import { onMounted, ref } from "vue";
import htmlGenerator from "./resumeUtils/htmlGenerator";
import jsonUtils from "./resumeUtils/jsonUtils";
import template from "../../../templates/templates.json";
import { email } from "@vueform/vueform";

const innerHtml = ref(null);

// const props = defineProps({
//   resume_data: {
//     type: Object,
//     required: true,
//   },
// });

const resume_data = {
  metadata: {
    resume_template: "template1",
    render_fields: ["awards", "education", "project", "skills", "awards"],
    section_dividers: true,
  },
  title: "Kyle Denney",
  email: "kyle.denney@email.com",
  phone_number: "555-123-4567",
  professional_summary:
    "Bachelor of Arts degree candidate, with a major in Economics, and experience developing and analyzing cost models, providing quality assurance reviews, and creating process solutions to improve financial forecasts for clients. Looking to continue the development of risk management, audit, and compliance skills in a team-centered environment.",
  education: [
    {
      institution: "University of State",
      credential_earned: "Bachelor of Arts in Economics",
      date_to: "2024-05",
      date_from: "2020-08",
      gpa: "3.8",
      coursework: null,
    },
    {
      institution: "University of State",
      credential_earned: "Bachelor of Arts in Economics",
      date_to: "2024-05",
      date_from: "2020-08",
      gpa: "3.8",
      coursework: null,
    },
    {
      institution: "University of State",
      credential_earned: "Bachelor of Arts in Economics",
      date_to: "2024-05",
      date_from: "2020-08",
      gpa: "3.8",
      coursework: null,
    },
  ],
  experience: [
    {
      employer: "ABC Financial Services",
      position_title: "Financial Analyst Intern",
      date_start: "2023-06",
      date_end: "2023-08",
    },
    {
      employer: "ABC Financial Services",
      position_title: "Financial Analyst Intern",
      date_start: "2023-06",
      date_end: "2023-08",
    },
  ],
  skills: [
    {
      name: "Data Analysis",
      description:
        "Proficient in Excel, R, and SQL for data analysis and financial modeling.",
      proficiency_level: "Intermediate",
    },
  ],
  project: [
    {
      name: "Cost Optimization Project",
      description:
        "Developed cost models to identify process efficiencies, resulting in a 10% cost reduction.",
      date_start: "2023-01",
      date_completed: "2023-04",
    },
  ],
  awards: [
    {
      name: "Dean’s List",
      institution: "University of State",
      description: "Awarded for academic excellence in multiple semesters.",
      date_awarded: "2022-12",
    },
  ],
  url: [
    {
      name: "Portfolio",
      url: "https://kyledenneyportfolio.com",
    },
  ],
};

const renderPDF = () => {
  let full_json_object = {};
  let resume_template = template[resume_data.metadata.resume_template];

  let pdf_header = jsonUtils.findAndUpdateSectionByName(
    resume_template.structure.pdf_header,
    resume_template.data.pdf_header.title,
    resume_data.title
  );

  let personal_info = `${resume_data.email} | ${resume_data.phone_number}`;
  resume_data.url.forEach((value) => {
    personal_info += ` | ${value.name}: ${value.url}`;
  });

  pdf_header = jsonUtils.findAndUpdateSectionByName(
    pdf_header,
    resume_template.data.pdf_header.personal_info,
    personal_info
  );

  let professional_summary = jsonUtils.findAndUpdateSectionByName(
    resume_template.structure.professional_summary,
    resume_template.data.professional_summary,
    resume_data.professional_summary
  );

  let body_children = [pdf_header, professional_summary];
  resume_data.metadata.render_fields.forEach((value) => {
    let section = jsonUtils.findAndUpdateSectionByData(
      resume_template,
      resume_data,
      value
    );
    body_children.push({ ...section });
  });

  full_json_object = {
    resume: {
      section_name: "body",
      content: "",
      style: {
        "font-family": resume_template.structure.metadata.font,
      },
      children: body_children,
    },
  };

  console.log(full_json_object);

  innerHtml.value = htmlGenerator.generateHTMLFromTemplate(
    full_json_object.resume,
    resume_data.metadata
  );
};

// Should be used to toggle whether dividers should show
// const toggleDividers = () => {
//   template_metadata.value.section_dividers =
//     !template_metadata.value.section_dividers;
//   renderPDF();
// };

onMounted(() => {
  renderPDF();
});
</script>
<template>
  <div
    name="pdf-body"
    style="
      background-color: white;
      margin: 50px 150px;
      padding: 10px 10px;
      border-radius: 10px;
    "
  >
    <div v-html="innerHtml"></div>
  </div>
</template>

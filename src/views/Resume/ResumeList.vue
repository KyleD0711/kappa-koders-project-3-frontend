<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ResumeSidebar from "../../components/resume/ResumeSidebar.vue";
import { ref } from "vue";
import template from "../../../templates/templates.json";
const templateData = ref(template["template1"]);

const metadata = ref({
  render_fields: ["awards", "education", "project", "skills"],
  section_dividers: true,
});
const header_data = ref({
  fName: "Kyle",
  lName: "Denney",
  email: "kyle.denney@email.com",
  phone_number: "555-123-4567",
  professional_summary:
    "Bachelor of Arts degree candidate, with a major in Economics, and experience developing and analyzing cost models, providing quality assurance reviews, and creating process solutions to improve financial forecasts for clients. Looking to continue the development of risk management, audit, and compliance skills in a team-centered environment.",
  links: [
    {
      name: "Portfolio",
      url: "https://kyledenneyportfolio.com",
    },
  ],
});
const resume_data = ref({
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
});
</script>
<template>
  <div style="display: flex">
    <div style="width: 50%">
      <ResumeSidebar :resume_data="resume_data" />
    </div>
    <v-divider
      vertical
      :thickness="4"
      class="white border-opacity-100"
    ></v-divider>
    <div style="flex-grow: 1">
      <ResumeViewer
        :is-loaded="true"
        :template="templateData"
        :metadata="metadata"
        :header_data="header_data"
        :resume_data="resume_data"
      />
    </div>
  </div>
</template>

<style scoped>
.white {
  color: #737373;
  padding-left: 1%;
}
</style>

<script>
import { useRouter } from "vue-router";
import "primeicons/primeicons.css";

export default {
  setup() {
    const router = useRouter();

    const showExperience = () => {
      router.push({ name: "experience" });
    };

    const showSkills = () => {
      router.push({ name: "skills" });
    };

    const showAwards = () => {
      router.push({ name: "awards" });
    };

    const showLinks = () => {
      router.push({ name: "links" });
    };

    const showEducation = () => {
      router.push({ name: "education" });
    };

    const showProjects = () => {
      router.push({ name: "projects" });
    };

    const showUsers = () => {
      router.push({ name: "users" });
    };

    const showProfessionalSummaries = () => {
      router.push({ name: "professionalSummaries" });
    };

    return {
      showExperience,
      showSkills,
      showAwards,
      showLinks,
      showEducation,
      showProjects,
      showUsers,
      showProfessionalSummaries,
    };
  },
};
</script>

<template>
  <div class="infoSidebar">
    <div class="infoSection" @click="showExperience()">Experience</div>
    <div class="infoSection" @click="showSkills()">Skills</div>
    <div class="infoSection" @click="showAwards()">Awards</div>
    <div class="infoSection" @click="showLinks()">Links</div>
    <div class="infoSection" @click="showEducation()">Education</div>
    <div class="infoSection" @click="showProjects()">Projects</div>
    <div class="infoSection" @click="showUsers()">Users</div>
    <div class="infoSection" @click="showProfessionalSummaries()">
      Professional Summaries
    </div>
  </div>
</template>

<style>
.infoSidebar {
  width: 20%;
  height: 50%;
  background-color: #ccc;
}

.infoSection {
  height: 50px;
  width: 100%;
  background-color: #333;

  padding-left: 10px;
  align-content: center;
  color: #fff;

  margin-top: 5px;
  margin-bottom: 5px;

  border-radius: 10px;
}
</style>

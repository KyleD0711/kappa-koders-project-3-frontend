import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ResumeList from "./views/Resume/ResumeList.vue";
import ResumeView from "./views/Resume/ResumeView.vue";
import InformationList from "./views/Information/InformationList.vue";
import InfoExperience from "./components/InfoExperience.vue";
import InfoSkills from "./components/InfoSkills.vue";
import InfoAwards from "./components/InfoAwards.vue";
import InfoLinks from "./components/InfoLinks.vue";
import InfoEducation from "./components/InfoEducation.vue";
import InfoProjects from "./components/InfoProjects.vue";
import InfoUsers from "./components/InfoUsers.vue";
import ProfessionalSummaryView from "./components/professionalSummary/ProfessionalSummaryView.vue";
import AdminUserView from "./views/Admin/AdminUserView.vue";
import ReviewResumes from "./views/Admin/ReviewResumes.vue";
import ReviewResume from "./views/Admin/ReviewResume.vue";

import RouterStateController from "./utils/routerStateController.js";
import SkillView from "./components/skill/SkillView.vue";

const routerState = new RouterStateController();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/resume",
      name: "resumes",
      component: ResumeList,
    },
    {
      path: "/editResume/:resumeId",
      alias: "/resume",
      name: "editResume",
      component: ResumeView,
      props: (route) => ({ formId: Number(route.params.resumeId) }),
    },
    {
      path: "/login",
      alias: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/information",
      name: "information",
      component: InformationList,
      children: [
        {
          path: "experience",
          name: "experience",
          component: ExperienceView,
        },
        {
          path: "skills",
          name: "skills",
          component: SkillView,
        },
        {
          path: "awards",
          name: "awards",
          component: AwardView,
        },
        {
          path: "links",
          name: "links",
          component: LinkView,
        },
        {
          path: "education",
          name: "education",
          component: EducationView,
        },
        {
          path: "projects",
          name: "projects",
          component: ProjectView,
        },
        {
          path: "professionalSummaries",
          name: "professionalSummaries",
          component: ProfessionalSummaryView,
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      children: [
        {
          path: "users",
          name: "users",
          beforeEnter: isAdmin,
          component: AdminUserView,
        },
        {
          path: "reviewResumes",
          name: "reviewResumes",
          beforeEnter: isAdmin,
          component: ReviewResume,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await routerState.isAuthenticated();
  if (!isAuthenticated) {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    if (to.path == "/login") {
      next({ path: "/" });
    } else {
      next();
    }
  }
});

function isAdmin(to) {
  const hasAdminPrivileges = routerState.isAdmin();
  if (!hasAdminPrivileges) {
    return { path: "/resume" };
  }
}

export default router;

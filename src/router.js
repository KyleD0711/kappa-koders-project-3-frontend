import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ResumeView from "./views/Resume/ResumeList.vue";
import InformationList from "./views/Information/InformationList.vue";
import InfoExperience from "./components/InfoExperience.vue"
import InfoSkills from "./components/InfoSkills.vue"
import InfoAwards from "./components/InfoAwards.vue"
import InfoLinks from "./components/InfoLinks.vue"
import InfoEducation from "./components/InfoEducation.vue"
import InfoProjects from "./components/InfoProjects.vue"
import InfoUsers from "./components/InfoUsers.vue"


import InformationView from "./views/Information/InformationList.vue";
import AwardView from "./components/award/AwardView.vue"

import RouterStateController from "./utils/routerStateController.js";

const routerState = new RouterStateController();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/resume",
      name: "resume",
      component: ResumeView,
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
      component: InformationView,
    },
    {
      path: "/award",
      name: "award",
      component: AwardView
    }
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
    next();
  }
});

export default router;

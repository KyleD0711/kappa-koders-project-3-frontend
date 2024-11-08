import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import ResumeView from "./views/Resume/ResumeList.vue";
import InformationView from "./views/Information/InformationList.vue";

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
    if(to.path == "/login") {
      next({ path: "/"})
    }
    else {
      next();
    }
  }
});

export default router;

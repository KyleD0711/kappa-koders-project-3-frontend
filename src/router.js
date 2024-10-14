import Vue from "vue";
import Router from "vue-router";

import Calendar from "./views/Calendar.vue";
import Contract from "./views/Contract.vue";
import Help from "./views/Help.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import MyInfo from "./views/MyInfo.vue";
import PageNotFound from "./views/PageNotFound.vue";

// Admin Screens
import AdminApprove from "./views/Admin/AdminApprove.vue";
import AdminHome from "./views/Admin/AdminHome.vue";
import AdminReports from "./views/Admin/AdminReports.vue";
import RequestList from "./views/Admin/RequestList.vue";

//Group
import GroupList from "./views/Admin/Group/GroupList.vue";
import GroupEdit from "./views/Admin/Group/GroupEdit.vue";
import GroupAdd from "./views/Admin/Group/GroupAdd.vue";
import GroupView from "./views/Admin/Group/GroupView.vue";

// Location
import LocationList from "./views/Admin/LocationList.vue";

// Person
import PersonList from "./views/Admin/PersonList.vue";

// Role
import RoleList from "./views/Admin/RoleList.vue";

// Topic
import TopicList from "./views/Admin/TopicList.vue";

// Tutor Screens

import TutorAddAvailability from "./views/TutorAddAvailability.vue";
import TutorAddTopics from "./views/TutorAddTopics.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  linkExactActiveClass: "active",
  base: process.env.NODE_ENV === "development" ? "/" : "/",
  routes: [
    {
      path: "/calendar/:id",
      name: "calendar",
      component: Calendar,
      props: true,
    },
    {
      path: "/contract/:id",
      name: "contract",
      component: Contract,
      props: true,
    },
    {
      path: "/help/:id",
      name: "help",
      component: Help,
      props: true,
    },
    {
      path: "/home/:id",
      name: "home",
      component: Home,
      props: true,
    },
    {
      path: "/",
      name: "login",
      alias: "/login",
      component: Login,
    },
    {
      path: "/myInfo/:id",
      name: "myInfo",
      component: MyInfo,
      props: true,
    },
    {
      path: "/groupAdd/:id",
      name: "groupAdd",
      component: GroupAdd,
      props: true,
    },
    {
      path: "/groupEdit/:id",
      name: "groupEdit",
      component: GroupEdit,
      props: true,
    },
    {
      path: "/groupList/:id",
      name: "groupList",
      component: GroupList,
      props: true,
    },
    {
      path: "/groupView/:id/:groupId",
      name: "groupView",
      component: GroupView,
      props: true,
    },
    {
      path: "/locationList/:id",
      name: "locationList",
      component: LocationList,
      props: true,
    },
    {
      path: "/personList/:id",
      name: "personList",
      component: PersonList,
      props: true,
    },
    {
      path: "/roleList/:id",
      name: "roleList",
      component: RoleList,
      props: true,
    },
    {
      path: "/topicList/:id",
      name: "topicList",
      component: TopicList,
      props: true,
    },
    {
      path: "/adminApprove/:id",
      name: "adminApprove",
      component: AdminApprove,
      props: true,
    },
    {
      path: "/adminHome/:id",
      name: "adminHome",
      component: AdminHome,
      props: true,
    },
    {
      path: "/adminReports/:id",
      name: "adminReports",
      component: AdminReports,
      props: true,
    },
    {
      path: "/requestList/:id",
      name: "requestList",
      component: RequestList,
      props: true,
    },
    {
      path: "/tutorAddAvailability/:id",
      name: "tutorAddAvailability",
      component: TutorAddAvailability,
      props: true,
    },
    {
      path: "/tutorAddTopics/:id",
      name: "tutorAddTopics",
      component: TutorAddTopics,
      props: true,
    },
    {
      path: "*",
      component: PageNotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const user = localStorage.getItem("user");
  if (user === null && to.path !== "/") {
    return next({
      path: "/",
      query: { redirect: to.fullPath },
    });
  } else {
    next({
      query: { redirect: to.fullPath },
    });
  }
});

export default router;

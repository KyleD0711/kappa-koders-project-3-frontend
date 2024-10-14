import GroupServices from "../services/groupServices";
import Utils from "../config/utils";

export const RedirectToPageMixin = {
  data() {
    return {
      openSelect: false,
      contractRoles: [],
      topicRoles: [],
      personRoles: [],
      user: {},
    };
  },
  methods: {
    handleRedundantNavigation(name, id) {
      if (id === null) {
        this.$router
          .push({
            name: name,
          })
          .catch((err) => {
            // Ignore the vuex err regarding  navigating to the page they are already on.
            if (
              err.name !== "NavigationDuplicated" &&
              !err.message.includes(
                "Avoided redundant navigation to current location"
              )
            ) {
              // But print any other errors to the console
              console.log(err);
            }
          });
      } else {
        this.$router
          .push({
            name: name,
            params: { id: id },
          })
          .catch((err) => {
            // Ignore the vuex err regarding  navigating to the page they are already on.
            if (
              err.name !== "NavigationDuplicated" &&
              !err.message.includes(
                "Avoided redundant navigation to current location"
              )
            ) {
              // But print any other errors to the console
              console.log(err);
            }
          });
      }
    },
    async getPersonRoles(personId) {
      this.user = Utils.getStore("user");
      await GroupServices.getContractsNeededForPerson(personId)
        .then((response) => {
          this.contractRoles = response.data;
        })
        .catch((error) => {
          console.log("There was an error:", error.response.data.message);
          return;
        });

      // if the user doesn't have any incomplete roles, get normal roles
      // topicRoles will include roles that do have topics
      if (this.contractRoles.length === 0) {
        await GroupServices.getTopicsNeededForTutor(personId)
          .then((response) => {
            this.topicRoles = response.data;
          })
          .catch((error) => {
            console.log(error);
            console.log("There was an error:", error.response.data.message);
            return;
          });
        await GroupServices.getGroupsForPerson(personId)
          .then((response) => {
            this.personRoles = response.data;
          })
          .catch((error) => {
            console.log("There was an error:", error.response.data.message);
            return;
          });
      }
    },
    async goToPage(personId) {
      await this.getPersonRoles(personId);
      if (this.personRoles.length === 0) {
        for (let i = 0; i < this.contractRoles.length; i++) {
          let group = this.contractRoles[i];
          for (let j = 0; j < group.role.length; j++) {
            let role = group.role[j];
            //if (role.type === "Student" || role.type === "Tutor") {
            if (role.type === "Tutor") {
              this.handleRedundantNavigation("contract", role.personrole[0].id);
              return;
            }
          }
        }
      } else {
        for (let i = 0; i < this.topicRoles.length; i++) {
          let group = this.topicRoles[i];
          if (
            group.topic.length === 0 &&
            group.role[0].personrole[0].status !== "disabled"
          ) {
            this.handleRedundantNavigation(
              "tutorAddTopics",
              group.role[0].personrole[0].id
            );
            return;
          }
        }
        if (
          this.user.selectedGroup === null ||
          this.user.selectedGroup === "" ||
          this.user.selectedGroup === undefined
        ) {
          let hasAdminRole = false;
          for (
            let i = 0;
            i < this.personRoles.length &&
            (this.user.selectedGroup === null ||
              this.user.selectedGroup === "" ||
              this.user.selectedGroup === undefined);
            i++
          ) {
            let group = this.personRoles[i];
            for (
              let j = 0;
              j < group.role.length &&
              (this.user.selectedGroup === null ||
                this.user.selectedGroup === "" ||
                this.user.selectedGroup === undefined);
              j++
            ) {
              let role = group.role[j];
              // check if there's a redirect url first and if the personRoleId matches the one in the url
              // also, if the redirect url is for a home page, check if the role type matches the role type in the url
              if (
                this.$route.query.redirect &&
                role.personrole[0].id ===
                  parseInt(
                    this.$route.query.redirect
                      .split("/")
                      .slice(1)[1]
                      .split("?")[0]
                  ) &&
                (this.$route.query.redirect.includes("home")
                  ? this.$route.query.redirect.includes(role.type.toLowerCase())
                  : true)
              ) {
                this.user.selectedGroup = group.name;
                this.user.selectedRole = {
                  type: role.type,
                  personRoleId: role.personrole[0].id,
                };
                Utils.setStore("user", this.user);
                this.$router.push(this.$route.query.redirect);
                return;
              } else if (role.type === "Admin") {
                hasAdminRole = true;
              }
            }
          }

          // if we still need to check for admin roles, do it here
          for (let i = 0; i < this.personRoles.length && hasAdminRole; i++) {
            let group = this.personRoles[i];
            for (
              let j = 0;
              j < group.role.length &&
              (this.user.selectedGroup === null ||
                this.user.selectedGroup === "" ||
                this.user.selectedGroup === undefined);
              j++
            ) {
              let role = group.role[j];
              // if not, check if there's an admin role
              if (role.type === "Admin") {
                this.user.selectedGroup = group.name;
                this.user.selectedRole = {
                  type: role.type,
                  personRoleId: role.personrole[0].id,
                };
                Utils.setStore("user", this.user);
                this.handleRedundantNavigation(
                  "adminHome",
                  role.personrole[0].id
                );

                return;
              }
            }
          }
        }

        // if there's no redirect url or admin role, allow the user to select the group and role
        this.openSelect = true;
      }
    },
  },
};

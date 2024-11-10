import { defineStore } from "pinia";
import { useRoute } from "vue-router";
import { watchEffect } from "vue";

import Utils from "../config/utils";
import AuthServices from "../services/authServices.js";

export const useNavBarStore = defineStore('navBar', {
    state: () => ({
      currentRoute: null,
      showNavOptions: true
    }),
    actions: {
      setupRouteWatcher() {
        const route = useRoute();
        watchEffect(
            async () => {
                const previousRoute = this.currentRoute;
                const user = Utils.getStore("user");

                this.currentRoute = route.fullPath;
         
                if(this.currentRoute == "/login" || previousRoute == "/login") {
                    try {

                        const isValidToken = await AuthServices.validateToken(user);

                        if(isValidToken) {
                            console.log("Valid Token");
                            this.showNavOptions = true
                        }
                        
                    } catch {
                        console.log("Invalid Token")
                        this.showNavOptions = false
                    }
                }
            }
          );
      }
    }
  });
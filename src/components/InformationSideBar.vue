<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useModalStore } from "../store/modal.store";
import userServices from "../services/userServices";
import { storeToRefs } from "pinia";
import Utils from "../config/utils";

import 'primeicons/primeicons.css';


export default {
    setup() {
        const router = useRouter();
        const curUser = ref(null);
        const modalStore = useModalStore();
        let showUser = ref(false);

        const showExperience = () => {
            router.push({name: 'experience'});
            let x = document.getElementsByClassName('infoSection');
            for (let item of x) {
                item.classList.remove('active');
            }
            document.getElementById('exp').classList.add('active');
        }

        const showSkills = () => {
            router.push({name: 'skills'});
            let x = document.getElementsByClassName('infoSection');
            for (let item of x) {
                item.classList.remove('active');
            }
            document.getElementById('skill').classList.add('active');
        }

        const showAwards = () => {
            router.push({name: 'awards'});
            let x = document.getElementsByClassName('infoSection');
            for (let item of x) {
                item.classList.remove('active');
            }
            document.getElementById('awards').classList.add('active');
        }

        const showLinks = () => {
            router.push({name: 'links'});
            let x = document.getElementsByClassName('infoSection');
            for (let item of x) {
                item.classList.remove('active');
            }
            document.getElementById('links').classList.add('active');
        }

        const showEducation = () => {
            router.push({name: 'education'});
            let x = document.getElementsByClassName('infoSection');
            for (let item of x) {
                item.classList.remove('active');
            }
            document.getElementById('edu').classList.add('active');
        }

        const showProjects = () => {
            router.push({name: 'projects'});
            let x = document.getElementsByClassName('infoSection');
            for (let item of x) {
                item.classList.remove('active');
            }
            document.getElementById('proj').classList.add('active');
        }

        const showProfessionalSummaries = () => {
          router.push({name: 'professionalSummaries'});
          let x = document.getElementsByClassName('infoSection');
          for (let item of x) {
                item.classList.remove('active');
            }
          document.getElementById('summ').classList.add('active');
        }

    const items = ref({});

    const isAdmin = async () => {
        showUser.value = false;
        await userServices
        .getAllUser()
        .then((res) => {
            curUser.value = Utils.getStore("user");
            items.value = res.data;
            items.value.forEach(user => {
                user.userRole.forEach(role => {
                    if (role.role.type === "admin" && user.id == curUser.value.userId) {
                        showUser.value = true;
                    } 
                })
            })
        })
    }

        onMounted(() => {
            isAdmin();
        })

    return {
            showUser,
      showExperience,
      showSkills,
      showAwards,
      showLinks,
      showEducation,
      showProjects,
      showProfessionalSummaries,
    };
  },
};
</script>

<template>
  <v-card class="infoSidebar" color="section0">

    <div id="exp" class="infoSection exp" color="section0" @click="showExperience()"> 
            <i class="pi pi-briefcase"></i>
            Experience
    </div>
    <div id="skill" class="infoSection skill" color="section0" @click="showSkills()">
        <i class="pi pi-lightbulb"></i>
        Skills
    </div>
    <div id="awards" class="infoSection awards" color="section0" @click="showAwards()">
        <i class="pi pi-trophy"></i>
        Awards
    </div>
    <div id="links" color="section0" class="infoSection links" @click="showLinks()">
        <i class="pi pi-link"></i>
        Links
    </div>
    <div id="edu" color="section0" class="infoSection edu" @click="showEducation()">
        <i class="pi pi-graduation-cap"></i>
        Education
    </div>
    <div id="proj" color="section0" class="infoSection proj" @click="showProjects()">
        <i class="pi pi-book"></i>
        Projects
    </div>
    <div id="summ" color="section0" class="infoSection summ" @click="showProfessionalSummaries()">
      <i class="pi pi-verified"></i>
      Professional Summaries
    </div>
</v-card>
</template>

<style>

.pi {

    padding-left: 5px;
    padding-right: 5px;
    font-weight: 700;

}

.active {
    background-color: #eee !important;
    color: #262626 !important;
}
.infoSidebar {
    width: 20%;
    height: 100%;
}

.infoSection {
    height: 60px;
    width: 100%;

    padding-left: 15px;
    align-content: center;

    font-size: 18px;
    font-weight: 700;
}
</style>

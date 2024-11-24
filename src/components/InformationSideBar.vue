<script>
import { useRouter } from "vue-router";
import 'primeicons/primeicons.css';


export default {
  setup() {
    const router = useRouter();

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

    return {
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
  <div class="infoSidebar">
    <div id="exp" class="infoSection" @click="showExperience()"> 
        <i class="pi pi-briefcase"></i>
        Experience
    </div>
    <div id="skill" class="infoSection skill" @click="showSkills()">
        <i class="pi pi-lightbulb"></i>
        Skills
    </div>
    <div id="awards" class="infoSection awards" @click="showAwards()">
        <i class="pi pi-trophy"></i>
        Awards
    </div>
    <div id="links" class="infoSection links" @click="showLinks()">
        <i class="pi pi-link"></i>
        Links
    </div>
    <div id="edu" class="infoSection edu" @click="showEducation()">
        <i class="pi pi-graduation-cap"></i>
        Education
    </div>
    <div id="proj" class="infoSection proj" @click="showProjects()">
        <i class="pi pi-book"></i>
        Projects
    </div>
    <div id="summ" class="infoSection summ" @click="showProfessionalSummaries()">
      <i class="pi pi-verified"></i>
      Professional Summaries
    </div>
  </div>
</template>

<style>

.pi {

    padding-left: 5px;
    padding-right: 5px;
    font-weight: 700;

}

.active {
    background-color: #f2f4f3 !important;
}
.infoSidebar {
    width: 20%;
    height: 100%;
    background-color: #ccc;
}

.infoSection {
    height: 60px;
    width: 100%;
    background-color: #ccc;

    padding-left: 15px;
    align-content: center;
    color: #262626;

    font-size: 18px;
    font-weight: 700;
}
</style>

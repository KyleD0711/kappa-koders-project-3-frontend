<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useModalStore } from "../store/modal.store";
import userServices from "../services/userServices";
import { storeToRefs } from "pinia";
import Utils from "../config/utils";




export default {
    setup() {
        const router = useRouter();
        const curUser = ref(null);
        const modalStore = useModalStore();
        const { isVisible } = storeToRefs(modalStore); 
        let showUser = ref(false);

        const showExperience = () => {
            router.push({name: 'experience'});
        }

        const showSkills = () => {
            router.push({name: 'skills'});
        }

        const showAwards = () => {
            router.push({name: 'awards'});
        }

        const showLinks = () => {
            router.push({name: 'links'});
        }

        const showEducation = () => {
            router.push({name: 'education'});
        }

        const showProjects = () => {
            router.push({name: 'projects'});
        }

        const showUsers = () => {
            router.push({name: 'users'});
        }

        const items = ref({});

        const isAdmin = async () => {
            showUser.value = false;
            await userServices
            .getAllUser()
            .then((res) => {
                curUser.value = Utils.getStore("user");
                console.log(curUser.value);
                items.value = res.data;
                items.value.forEach(user => {
                    user.userRole.forEach(role => {
                        console.log(curUser.value.userId);
                        console.log(user.id)

                        if (role.role.type === "admin" && user.id == curUser.value.userId) {
                            showUser.value = true;
                            console.log("HERE")
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
            showUsers
        }

    }
}

</script>

<template>

<div class="infoSidebar">
    <div class="infoSection" @click="showExperience()">Experience</div>
    <div class="infoSection" @click="showSkills()">Skills</div>
    <div class="infoSection" @click="showAwards()">Awards</div>
    <div class="infoSection" @click="showLinks()">Links</div>
    <div class="infoSection" @click="showEducation()">Education</div>
    <div class="infoSection" @click="showProjects()">Projects</div>
    <div class="infoSection" v-show="showUser"  @click="showUsers()">Users</div>
</div>


</template>

<style>

.infoSidebar {
    width:20%;
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
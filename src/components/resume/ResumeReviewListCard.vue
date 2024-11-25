<script setup>

import { onMounted, ref } from 'vue';

import { useRouter } from "vue-router";

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

const router = useRouter();

const props = defineProps({
  resumeData: {
    type: Object,
    required: true,
  },
});

const reviewResume = () => {
    router.push({name: 'reviewResume', params:{resumeId: props.resumeData.id}})
}
</script>

<template>
    <v-card class="w-100" color="#646262" @click="reviewResume()">
        <v-img
            src="/ResumeExample.png"
            cover
        />
        <v-row class="align-center">
            <v-col cols="8">     
                <v-card-title class="text-wrap">
                  {{ props.resumeData.user.fName + ' ' + props.resumeData.user.lName }}
                </v-card-title>
                <v-card-text class="pt-0">
                  Resume Name:  {{ props.resumeData.name }}
                </v-card-text>
            </v-col>
        </v-row>
    </v-card>
</template>
<script setup>

import { ref } from 'vue';

const props = defineProps({
  resumeData: {
    type: Object,
    required: true,
  },
});

const resume = ref()

</script>

<template>
    <v-card class="w-100" color="#646262">
        <v-img
            src="./ResumeExample.png"
            cover
        />
        <v-row>
            <v-col cols="6">     
                <v-card-title>
                    {{ props.resumeData.name }}
                </v-card-title>
                <v-card-text class="pt-0">
                    Last Updated {{ props.resumeData.updatedAt }}
                </v-card-text>
            </v-col>
            <v-col cols="6" class="align-content-center">
                <v-row class="justify-end px-4" no-gutters>
                    <v-icon class="mr-4"  @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>
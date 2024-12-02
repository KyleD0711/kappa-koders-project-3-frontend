<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const router = useRouter();

const props = defineProps({
  resumeData: {
    type: Object,
    required: true,
  },
  screenshotSrc: { // Add this prop to receive the image source
    type: String,
    required: false,
  },
});

const emit = defineEmits(['delete']);

const dateToRelativeTime = (date) => {
  const inputDate = dayjs(date);
  const now = dayjs();

  if (!inputDate.isValid()) {
    return 'Invalid date';
  }

  const diffInDays = now.diff(inputDate, 'day');
  const diffInWeeks = now.diff(inputDate, 'week');
  const diffInMonths = now.diff(inputDate, 'month');
  const diffInYears = now.diff(inputDate, 'year');

  if (diffInYears >= 1) {
    return `${diffInYears} Year${diffInYears > 1 ? 's' : ''} ago`;
  } else if (diffInMonths >= 1) {
    return `${diffInMonths} Month${diffInMonths > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks >= 1) {
    return `${diffInWeeks} Week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays >= 2) {
    return `${diffInDays} Day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else {
    return 'Today';
  }
};

const editResume = () => {
  router.push({ name: 'editResume', params: { resumeId: props.resumeData.id } });
};

const deleteResume = () => {
  emit('delete', props.resumeData);
};
</script>

<template>
  <v-card class="w-100" color="#646262">
    <v-img
      :src="screenshotSrc || './ResumeExample.png'"  
      cover
      @click="editResume"
    />
    <v-row class="align-center">
      <v-col cols="8">     
        <v-card-title class="text-wrap">
          {{ props.resumeData.name }}
        </v-card-title>
        <v-card-text class="pt-0">
          Updated {{ dateToRelativeTime(props.resumeData.updatedAt) }}
        </v-card-text>
      </v-col>
      <v-col cols="4" class="align-content-center">
        <v-row class="justify-end px-4" no-gutters>
          <v-icon class="mr-4" @click="editResume()">
            mdi-pencil
          </v-icon>
          <v-icon @click="deleteResume()"> mdi-delete </v-icon>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
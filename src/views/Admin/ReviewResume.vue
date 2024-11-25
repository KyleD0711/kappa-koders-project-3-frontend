<script setup>
import ResumeViewer from "../../components/resume/ResumeViewer.vue";
import ReviewerSidebar from "../../components/admin/ReviewerSidebar.vue";
import reviewServices from "../../services/reviewServices";
import resumeSectionServices from "../../services/resumeSectionServices";
import getResumeService from "../../services/getResumeService";
import professionalSummaryServices from "../../services/professionalSummaryServices";
import { ref, onMounted } from "vue";
import { useReviewerSidebarStore } from "../../store/reviewerSidebar.store";

const props = defineProps({
  reviewId: {
    type: Number,
    required: true,
  },
});

const reviewerSidebarStore = useReviewerSidebarStore();
const metadata = ref({});
const resume_data = ref({});
const header_data = ref({});
const template = ref({});
const isLoaded = ref(false);
const sections = ref([]);

onMounted(async () => {
  const reviewResponse = await reviewServices
    .getReview(props.reviewId)
    .then(async (data) => {
      const review = { ...data.data };
      return getResumeService.getResume(review.resumeId).then((value) => {
        metadata.value = value.metaData;
        header_data.value = value.headerData;
        resume_data.value = value.resumeData;
        template.value = value.template;
        isLoaded.value = true;
        reviewerSidebarStore.updateOverviewData(review.summary);
        return {
          resumeId: review.resumeId,
          render_fields: value.metaData.render_fields,
        };
      });
    })
    .catch((err) => {
      console.log(err);
    });

  await resumeSectionServices
    .getSectionsForResumeWithCommentsForReview(
      reviewResponse.resumeId,
      props.reviewId
    )
    .then((response) => {
      let filteredResponse = response.data.filter(
        (value) => value.section_type != "link"
      );
      let sortedRespone = filteredResponse.sort((a, b) => {
        return (
          reviewResponse.render_fields.indexOf(a.section_type) -
          reviewResponse.render_fields.indexOf(b.section_type)
        );
      });
      sections.value = sortedRespone;
      reviewerSidebarStore.updateSectionData([]);
      sortedRespone.forEach((value) => {
        if (value.comments.length != 0) {
          reviewerSidebarStore.addSectionData(value.comments[0]);
        } else {
          reviewerSidebarStore.addSectionData({ text: "" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>
<template>
  <div style="display: flex; align-items: stretch">
    <div
      style="
        max-width: 30%;
        min-width: 15%;
        height: 100%;
        margin-top: 20px;
        border-color: #d9d9d9;
        border-right: 5px;
      "
    >
      <ReviewerSidebar
        :reviewId="props.reviewId"
        :sections="sections"
      ></ReviewerSidebar>
    </div>
    <v-divider
      vertical
      :thickness="4"
      class="white border-opacity-100"
    ></v-divider>
    <div style="padding-left: 10%">
      <ResumeViewer
        :metadata="metadata"
        :resume_data="resume_data"
        :header_data="header_data"
        :template="template"
        :isLoaded="isLoaded"
      ></ResumeViewer>
    </div>
  </div>
</template>
<style scoped>
.white {
  color: #737373;
  padding-left: 1%;
}
</style>

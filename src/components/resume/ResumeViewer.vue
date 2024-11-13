<script setup>
import { onMounted, ref } from "vue";
import htmlGenerator from "./resumeUtils/htmlGenerator";
import jsonUtils from "./resumeUtils/jsonUtils";

const innerHtml = ref(null);

const props = defineProps({
  resume_data: {
    type: Object,
    required: true,
  },
  metadata: {
    type: Object,
    required: true,
  },
  header_data: {
    type: Object,
    required: true,
  },
  template: {
    type: Object,
    required: true,
  },
});

const renderPDF = () => {
  let full_json_object = {};

  let header_data = props.header_data;
  let metadata = props.metadata;
  let resume_data = props.resume_data;
  let template = props.template;

  let title = `${header_data.fName} ${header_data.lName}`;

  let pdf_header = jsonUtils.findAndUpdateSectionByName(
    template.structure.pdf_header,
    template.data.pdf_header.title,
    title
  );

  let personal_info = `${header_data.email} | ${header_data.phone_number}`;
  header_data.links.forEach((value) => {
    personal_info += ` | ${value.name}: ${value.url}`;
  });

  pdf_header = jsonUtils.findAndUpdateSectionByName(
    pdf_header,
    template.data.pdf_header.personal_info,
    personal_info
  );

  let professional_summary = jsonUtils.findAndUpdateSectionByName(
    template.structure.professional_summary,
    template.data.professional_summary,
    header_data.professional_summary
  );

  let body_children = [pdf_header, professional_summary];
  metadata.render_fields.forEach((value) => {
    let section = jsonUtils.findAndUpdateSectionByData(
      template,
      resume_data,
      value
    );
    body_children.push({ ...section });
  });

  full_json_object = {
    resume: {
      section_name: "body",
      style: {
        "font-family": template.structure.metadata.font,
      },
      children: body_children,
    },
  };

  innerHtml.value = htmlGenerator.generateHTMLFromTemplate(
    full_json_object.resume,
    metadata
  );
};
onMounted(() => {
  renderPDF();
});
</script>
<template>
  <div
    name="pdf-body"
    style="
      background-color: white;
      margin: 25px 50px;
      padding: 10px 10px;
      border-radius: 10px;
    "
  >
    <div v-html="innerHtml"></div>
  </div>
</template>

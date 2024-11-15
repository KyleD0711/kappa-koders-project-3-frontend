<script setup>
import { ref, watch, toRaw } from "vue";
import htmlGenerator from "./resumeUtils/htmlGenerator";
import jsonUtils from "./resumeUtils/jsonUtils";
import NoDataFound from "./NoDataFound.vue";

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
  isLoaded: {
    type: Boolean,
    required: true,
  },
});

const renderPDF = () => {
  let full_json_object = {};

  let header_data = props.header_data;
  let metadata = props.metadata;
  let resume_data = props.resume_data;
  let template = props.template;

  console.log(JSON.stringify(metadata, null, 2));
  console.log(JSON.stringify(header_data, null, 2));
  console.log(JSON.stringify(resume_data, null, 2));

  let title = `${header_data.fName} ${header_data.lName}`;

  let pdf_header = jsonUtils.findAndUpdateSectionByName(
    template.structure.pdf_header,
    template.data.pdf_header.title,
    title
  );

  let personal_info = `${header_data.email} | ${header_data.phone_number}`;
  
  let linkArray = (header_data.link ?? []).map((value) => ({
    name: value.name,
    url: value.url
  }));

  linkArray.forEach((value) => {
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

  console.log("-------------------------------");


  let renderFieldsArray = toRaw(metadata.render_fields);
  
  const deepToRaw = (data) => {
    // Check if the data is an array
    if (Array.isArray(data)) {
      return data.map(item => toRaw(item)); // Remove reactivity from each array item
    }
    // If it's not an array, return as is
    return data;
  };

  // Unwrap the object properties
  const rawResumeData = {};
  Object.keys(props.resume_data).forEach(key => {
    rawResumeData[key] = deepToRaw(toRaw(props.resume_data[key]));
  });

  console.log(rawResumeData)
  
  renderFieldsArray.forEach((render_field) => {
    let section = jsonUtils.findAndUpdateSectionByData(
      template,
      rawResumeData,
      render_field
    );
    body_children.push({ ...section });
  });

  console.log("-------------------------------");


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

watch(props, () => {
  if (props.isLoaded) {
    renderPDF();
  }
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
    <NoDataFound v-if="!props.isLoaded"></NoDataFound>
    <div v-else v-html="innerHtml"></div>
  </div>
</template>
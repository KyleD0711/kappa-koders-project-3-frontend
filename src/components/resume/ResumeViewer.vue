<script setup>
import {
  ref,
  watch,
  onMounted,
  defineExpose,
  onBeforeUnmount,
  toRaw,
} from "vue";
import htmlGenerator from "./resumeUtils/htmlGenerator";
import jsonUtils from "./resumeUtils/jsonUtils";
import NoDataFound from "./NoDataFound.vue";
import { storeToRefs } from "pinia";
import { useResumeViewerStore } from "../../store/resumeViewer.store";

const resumeViewerStore = useResumeViewerStore();
const { innerHTML } = storeToRefs(resumeViewerStore);

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

  let title = `${header_data.fName} ${header_data.lName}`;

  let pdf_header = jsonUtils.findAndUpdateSectionDataByName(
    template.structure.pdf_header,
    template.data.pdf_header.title,
    title
  );

  let personal_info = "";

  if (header_data.email != "" && header_data.phone_number != "") {
    personal_info = `${header_data.email} | ${header_data.phone_number}`;
  } else {
    personal_info =
      header_data.email == ""
        ? `${header_data.phone_number}`
        : `${header_data.email}`;
  }

  let linkArray = (header_data.link ?? []).map((value) => ({
    name: value.name,
    url: value.url,
  }));

  linkArray.forEach((value) => {
    personal_info += ` | ${value.name}: ${value.url}`;
  });

  pdf_header = jsonUtils.findAndUpdateSectionDataByName(
    pdf_header,
    template.data.pdf_header.personal_info,
    personal_info
  );

  let body_children = [pdf_header];

  if (header_data.professional_summary != "") {
    let professional_summary = jsonUtils.findAndUpdateSectionDataByName(
      template.structure.professional_summary,
      template.data.professional_summary,
      header_data.professional_summary
    );
    body_children = [...body_children, professional_summary];
  }

  let renderFieldsArray = toRaw(metadata.render_fields);

  const deepToRaw = (data) => {
    // Check if the data is an array
    if (Array.isArray(data)) {
      return data.map((item) => toRaw(item)); // Remove reactivity from each array item
    }
    // If it's not an array, return as is
    return data;
  };

  // Unwrap the object properties
  const rawResumeData = {};
  Object.keys(props.resume_data).forEach((key) => {
    rawResumeData[key] = deepToRaw(toRaw(props.resume_data[key]));
  });

  renderFieldsArray.forEach((render_field) => {
    let section = jsonUtils.findAndUpdateSectionByData(
      template,
      rawResumeData,
      render_field
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

  let newHtml = htmlGenerator.generateHTMLFromTemplate(
    full_json_object.resume,
    metadata
  );

  resumeViewerStore.updateInnerHTML(newHtml);
  updatePdfContent();
};

const updatePdfContent = () => {
  if (pdf.value) {
    const pdfContent = pdf.value.outerHTML; // Get the entire HTML content as a string
    resumeViewerStore.updatePdf(pdfContent);
  }
};

watch(props, () => {
  if (props.isLoaded) {
    renderPDF();
  }
});

const pdf = ref(null);

defineExpose({
  pdf,
});

const getScreenDPI = () => {
  // Create a temporary element to calculate DPI
  const dpiTest = document.createElement("div");
  dpiTest.style.width = "1in";
  dpiTest.style.height = "1in";
  dpiTest.style.position = "absolute";
  dpiTest.style.top = "-9999px"; // Hide it off-screen
  document.body.appendChild(dpiTest);

  // Measure the DPI
  const dpi = dpiTest.offsetWidth;
  document.body.removeChild(dpiTest);
  return dpi;
};
const setPDFWidth = () => {
  const dpi = getScreenDPI(); // Get screen DPI
  const pdfWidth = 8.5 * dpi; // Calculate width for 8.5 inches
  const pdfHeight = 11 * dpi; // Calculate height for 11 inches

  if (pdf.value) {
    pdf.value.style.width = `${pdfWidth}px`;
    pdf.value.style["min-height"] = `${pdfHeight}px`;
  }
};

onMounted(() => {
  setPDFWidth(); // Set the paper width when the component is mounted
  window.addEventListener("resize", setPDFWidth); // Update on window resize
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setPDFWidth);
});




</script>
<template>
  <div
    ref="pdf"
    name="pdf"
    style="
      max-width: 886px;
      aspect-ratio: 1 / 1.294;
      background-color: white;
      color: black;
      overflow: hidden; /* Ensure no content spills out */
      box-sizing: border-box; /* Include padding in the total size */
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a slight shadow for realism */
    "
  >
    <NoDataFound v-if="!props.isLoaded"></NoDataFound>
    <div v-else v-html="innerHTML"></div>
  </div>
</template>

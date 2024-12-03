export default {
  generateHTMLFromTemplate(template, metadata) {
    // Helper function to convert style object to inline CSS string
    function styleToString(style) {
      return Object.entries(style)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ");
    }

    // Recursive function to build HTML elements
    function buildElement(element) {
      if (element.type == "") {
        element.type = "div";
      }
      const {
        section_name = "",
        style = {},
        content = "",
        children = [],
        type = "div",
      } = element;
      const styleString = styleToString(style);
      let openTag = `<${type} class="${section_name}" style="${styleString}">`;
      let closeTag = `</${type}>`;

      if (section_name == "divider" && metadata.section_dividers) {
        openTag = getDividerTag();
      }
      // Create opening tag with inline styles

      // Build inner content (content + recursive children elements)
      const innerContent = content + children.map(buildElement).join("");

      // Combine opening tag, content, children, and closing tag
      return `${openTag}${innerContent}${closeTag}`;
    }

    // Start building from the root template object
    return buildElement(template);
  },
  parseHTMLToJSON(htmlString) {
    // Helper function to parse inline styles into a JSON format
    function parseStyles(styleString) {
      return styleString
        .split(";")
        .filter((style) => style.trim())
        .reduce((styles, style) => {
          const [key, value] = style.split(":");
          styles[key.trim()] = value.trim();
          return styles;
        }, {});
    }

    // Recursive function to parse each DOM element
    function elementToJSON(element) {
      return {
        section_name: element.className || element.tagName.toLowerCase(),
        style: element.getAttribute("style")
          ? parseStyles(element.getAttribute("style"))
          : {},
        content:
          element.childNodes.length === 1 &&
          element.childNodes[0].nodeType === Node.TEXT_NODE
            ? element.textContent.trim()
            : "",
        children: Array.from(element.children).map((child) =>
          elementToJSON(child)
        ),
      };
    }

    // Create a DOMParser to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    // Assuming the root div is the main container we want to parse
    const rootElement = doc.body.firstElementChild;

    return elementToJSON(rootElement);
  },
};

function getDividerTag() {
  return `<div style="height: 3px; width: 100%; background-color: black;">`;
}

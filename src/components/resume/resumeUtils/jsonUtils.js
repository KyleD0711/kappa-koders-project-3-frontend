export default {
  findAndUpdateSectionByName(jsonObj, targetSectionName, data) {
    // Base case: Check if the current object's section_name matches the target
    if (jsonObj.section_name === targetSectionName.section_name) {
      jsonObj.content = data; // Update content with the provided data
      return jsonObj;
    }

    // Recursive case: Iterate over children and search within each child
    if (jsonObj.children) {
      for (let child of jsonObj.children) {
        const result = this.findAndUpdateSectionByName(
          child,
          targetSectionName,
          data
        );
        if (result !== null) {
          return jsonObj; // Return the updated original JSON object
        }
      }
    }

    // Return null if the target section_name is not found in this path
    return null;
  },
  findAndUpdateSectionByData(template, data, section_name) {
    let elements = data[section_name];

    let header = template.structure[section_name].children[0];
    let body = template.structure[section_name].children[1];
    let bodyItems = [];

    elements.forEach((value) => {
      Object.entries(value).forEach((entry) => {
        if (value[entry[0]] == null) {
          return;
        }
        body = this.findAndUpdateSectionByName(
          body,
          template.data[section_name][entry[0]],
          value[entry[0]]
        );
      });
      bodyItems.push(body);
    });

    return {
      section_name: `${section_name}`,
      style: {},
      content: "",
      children: [
        {
          ...header,
        },
        {
          section_name: `section_body`,
          style: {},
          content: "",
          children: [
            ...bodyItems.map((value) => {
              return { ...value };
            }),
          ],
        },
      ],
    };
  },
  generateJsonForSection(section_name, data) {},
};

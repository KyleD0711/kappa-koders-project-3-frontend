export default {
  findAndUpdateSectionDataByName(jsonObj, targetSectionName, data) {
    // console.log(targetSectionName);
    // Base case: Check if the current object's section_name matches the target
    if (jsonObj.section_name === targetSectionName.section_name) {
      jsonObj.content = data; // Update content with the provided data
      return jsonObj;
    }

    // Recursive case: Iterate over children and search within each child
    if (jsonObj.children) {
      for (let child of jsonObj.children) {
        const result = this.findAndUpdateSectionDataByName(
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
  findAndUpdateSectionChildrenByName(jsonObj, targetSectionName, children) {
    // console.log(targetSectionName);
    // Base case: Check if the current object's section_name matches the target
    if (jsonObj.section_name === targetSectionName.section_name) {
      jsonObj.children = children; // Update content with the provided data
      return jsonObj;
    }

    // Recursive case: Iterate over children and search within each child
    if (jsonObj.children) {
      for (let child of jsonObj.children) {
        const result = this.findAndUpdateSectionChildrenByName(
          child,
          targetSectionName,
          children
        );
        if (result !== null) {
          return jsonObj; // Return the updated original JSON object
        }
      }
    }

    // Return null if the target section_name is not found in this path
    return null;
  },
  listToJson(list) {
    return [
      {
        section_name: "",
        content: "",
        children: list.map((item) => ({
          type: "li",
          content: item,
          style: {
            "padding-left": "5px",
          },
          children: [],
        })),
      },
    ];
  },
  findAndUpdateSectionByData(template, data, section_name) {
    let elements = data[section_name];

    let header = template.structure[section_name].children[0];
    let bodyTemplate = template.structure[section_name].children[1];
    let bodyItems = [];

    elements.forEach((value) => {
      let body = JSON.parse(JSON.stringify(bodyTemplate)); // Clone the body template

      Object.entries(value).forEach((entry) => {
        if (
          value[entry[0]] == null ||
          template.data[section_name][entry[0]] === undefined
        ) {
          return;
        }

        if (
          entry[0] == "coursework" ||
          (entry[0] == "description" &&
            section_name != "award" &&
            section_name != "project")
        ) {
          if (value[entry[0]] != "") {
            let splitEntries = value[entry[0]].split("\n");
            let listOfData = this.listToJson(splitEntries);
            body = this.findAndUpdateSectionChildrenByName(
              body,
              template.data[section_name][entry[0]],
              listOfData
            );
          }
        } else {
          body = this.findAndUpdateSectionDataByName(
            body,
            template.data[section_name][entry[0]],
            value[entry[0]]
          );
        }
      });

      // Make sure to handle case where it can't find section name
      if (body != null) {
        bodyItems.push(body);
      }
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
};

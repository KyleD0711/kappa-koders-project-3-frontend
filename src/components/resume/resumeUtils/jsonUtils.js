export default {
  findAndUpdateSectionByName(jsonObj, targetSectionName, data) {
    // console.log(targetSectionName);
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
      console.log(value);
      Object.entries(value).forEach((entry) => {
        // Check if the value or template data entry is null or undefined
        if (value[entry[0]] == null || template.data[section_name][entry[0]] === undefined) {
          return; // Skip if either is null or undefined
        }
    
        body = this.findAndUpdateSectionByName(
          body,
          template.data[section_name][entry[0]],
          value[entry[0]]
        );
      });
    
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

const { ObjectId } = require("mongodb");
const { getCollection } = require("../db");

const Template = getCollection('templates');

const createTemplateBody = async (templateId, variables) => {

  const foundTemplate = await Template.findOne({
    _id: new ObjectId(templateId)
  });

  const templateBody = {
    name: foundTemplate?.name,
    language: {
      code: foundTemplate?.language
    },
    components: []
  };

  for (let comp of foundTemplate?.components) {
    //handling variables of body component
    if (comp?.type === "HEADER" && comp?.format === 'IMAGE') {
      templateBody.components.push({
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: variables?.headerImageUrl || comp?.defaultUrl
            }
          }
        ]
      });
    }
    //handling variables of body component
    else if (comp?.type === "BODY" && comp?.variables) {
      const bodyObj = {
        type: "BODY",
        parameters: []
      };
      for (let bodyVar of comp?.variables) {
        bodyObj.parameters.push({
          type: 'text',
          text: variables[bodyVar]
        })
      }
      templateBody.components.push(bodyObj);
    }
    //handling variables of buttons component
    else if (comp?.type === "BUTTONS") {
      let buttonIndex = 0;
      for (let button of comp?.buttons) {
        if (button?.variables?.length > 0) {
          const buttonObj = {
            type: "BUTTON",
            index: buttonIndex,
            sub_type: button?.type,
            parameters: []
          };
          for (let buttonVar of button?.variables) {
            buttonObj.parameters.push({
              type: 'text',
              text: variables[buttonVar]
            })
          }
          templateBody.components.push(buttonObj);
        }
        buttonIndex++;
      }
    }
  }
  return templateBody;
}

module.exports = createTemplateBody;
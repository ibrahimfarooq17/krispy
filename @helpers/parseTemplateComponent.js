const {
	extractVariables,
	addSearchParamsToUrl,
	generateRandomString,
} = require('../utils');
const { TEMPLATE_VARIABLES } = require('../exports');

const parseTemplateComponent = ({ component, type, flow }) => {
	const allowedTemplateVars = TEMPLATE_VARIABLES.find(
		(templateVars) => templateVars.flow === flow
	).variables;

	switch (type) {
		case 'BODY': {
			const parsedTemplateBody = extractVariables(
				component?.text,
				allowedTemplateVars
			);
			return {
				componentToSave: {
					type: 'BODY',
					text: component?.text,
					variables: parsedTemplateBody.variables,
				},
				componentToPost: {
					type: 'BODY',
					text: parsedTemplateBody.text,
					...(parsedTemplateBody.examples.length > 0 && {
						example: {
							body_text: [parsedTemplateBody.examples],
						},
					}),
				},
			};
		}
		case 'BUTTONS': {
			const parsedTemplateButtonsToSave = [],
				parsedTemplateButtonsToPost = [];
			for (let button of component?.buttons) {
				const buttonId = `cta-${generateRandomString(20)}`;
				if (button?.type === 'URL') {
					let parsedButton = extractVariables(button?.url, allowedTemplateVars);
					parsedTemplateButtonsToSave.push({
						id: buttonId,
						type: button?.type,
						text: button?.text,
						url: button?.url,
						utms: button?.utms,
						variables: parsedButton.variables,
					});
					parsedTemplateButtonsToPost.push({
						type: button?.type,
						text: button?.text,
						...(parsedButton.examples.length > 0
							? {
									url: parsedButton.text,
									example: parsedButton.examples,
							  }
							: {
									url: addSearchParamsToUrl(button?.url, button?.utms),
							  }),
					});
				} else {
					parsedTemplateButtonsToSave.push({ id: buttonId, ...button });
					parsedTemplateButtonsToPost.push(button);
				}
			}
			return {
				componentToSave: {
					type: 'BUTTONS',
					buttons: parsedTemplateButtonsToSave,
				},
				componentToPost: {
					type: 'BUTTONS',
					buttons: parsedTemplateButtonsToPost,
				},
			};
		}
		default:
			return null;
	}
};

module.exports = parseTemplateComponent;

const getTemplateById = (templates, id) => {
	return templates.filter((template) => template.templateId === id)[0];
};

export default getTemplateById;

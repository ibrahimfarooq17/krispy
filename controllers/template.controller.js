const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const {
	krispyAxios,
	extractVariables,
	formatIds,
	getOptInButtons,
} = require('../utils');
const { TEMPLATE_VARIABLES } = require('../exports');
const parseTemplateComponent = require('../@helpers/parseTemplateComponent');
const getTemplateFooterText = require('../@helpers/getTemplateFooterText');
const { uploadFile } = require('../services/gcStorage');

const Preference = getCollection('preferences');
const Template = getCollection('templates');
const Flow = getCollection('flows');

// @desc    Adds a new template
// @route   POST /api/templates
// @access  PRIVATE
const addTemplate = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { name, language, category, flow, components } = req.body;
	const templateImage = req.files?.templateImage;
	const maxSizeBytes = 5 * 1024 * 1024; // 5 MB in bytes

	console.log('TEMPLATE REQUEST BODY:', JSON.stringify(req.body));
	console.log('TEMPLATE REQUEST IMAGE:', templateImage);

	const componentsToSave = [],
		componentsToPost = [];

	const foundPreference = await Preference.findOne({
		entity: new ObjectId(entityId),
	});
	if (!foundPreference?.d360ApiKey)
		return res.status(404).json({
			msg: 'No 360Dialog API Key found. Please make sure you have connected first.',
		});

	if (flow === 'SHOPIFY_ABANDONED_CHECKOUT' && !templateImage)
		return res
			.status(400)
			.json({ msg: 'Default image is required for Abandoned Checkout.' });

	//only allow on opt_in template at a time
	if (flow === 'OPT_IN') {
		const optInTemplateExists = await Template.findOne({
			entity: new ObjectId(entityId),
			flow: 'OPT_IN',
		});
		if (optInTemplateExists)
			return res.status(400).json({
				msg: 'Only one OPT_IN template is allowed. Please delete your existing one to create a new one.',
			});
	}

	//add header image if provided
	if (templateImage) {
		if (templateImage?.size > maxSizeBytes)
			return res
				.status(422)
				.json({ msg: 'Max template image size exceeded - 5MB.' });
		if (
			templateImage?.mimetype !== 'image/jpeg' &&
			templateImage.mimetype !== 'image/png'
		)
			return res.status(422).json({ msg: 'Only JPEG or PNG files allowed.' });
		//uploads the image to GCS
		const uploadedImageName = await uploadFile({
			name: templateImage?.name,
			data: templateImage?.data,
			folderName: 'templates-media',
		});
		if (!uploadedImageName)
			return res.status(500).json({
				msg: 'Something went wrong while uploading the template image!',
			});
		const imageUrl = `https://storage.googleapis.com/krispy-web-bucket/templates-media/${uploadedImageName}`;
		componentsToPost.push({
			type: 'HEADER',
			format: 'IMAGE',
			example: {
				header_handle: [imageUrl],
			},
		});
		componentsToSave.push({
			type: 'HEADER',
			format: 'IMAGE',
			defaultUrl: imageUrl,
		});
	}

	for (let component of components) {
		const parsedComponent = parseTemplateComponent({
			component,
			type: component?.type,
			flow,
		});
		componentsToSave.push(parsedComponent.componentToSave);
		componentsToPost.push(parsedComponent.componentToPost);
	}

	//add footer component to every template other than OPT_IN
	if (flow !== 'OPT_IN') {
		const footerComponent = {
			type: 'FOOTER',
			text: getTemplateFooterText(language),
		};
		componentsToSave.push(footerComponent);
		componentsToPost.push(footerComponent);
	}

	//add fixed buttons to opt in teplates
	if (flow === 'OPT_IN') {
		const { buttonsToSave, buttonsToPost } = getOptInButtons();
		componentsToSave.push(buttonsToSave);
		componentsToPost.push(buttonsToPost);
	}

	//create template
	const templateCreationRes = await krispyAxios({
		method: 'POST',
		url: 'https://waba-v2.360dialog.io/v1/configs/templates',
		headers: {
			'D360-API-KEY': foundPreference.d360ApiKey,
		},
		body: {
			name: name?.toLowerCase(),
			language,
			category,
			components: componentsToPost,
		},
	});
	if (templateCreationRes?.error)
		return res.status(500).json({
			msg: 'Error creating template!',
			details: templateCreationRes?.error,
		});

	await Template.insertOne({
		entity: new ObjectId(entityId),
		name,
		language,
		category,
		flow,
		components: componentsToSave,
		status: 'submitted',
		createdAt: new Date(),
	});
	return res
		.status(200)
		.json({ msg: 'Template created.', details: templateCreationRes.data });
};

// @desc    Gets all message templates
// @route   GET /api/templates
// @access  PRIVATE
const getAllTemplates = async (req, res) => {
	const entityId = req.user.entity.entityId;

	const foundPreference = await Preference.findOne({
		entity: new ObjectId(entityId),
	});
	if (!foundPreference?.d360ApiKey)
		return res.status(404).json({
			msg: 'No 360Dialog API Key found. Please make sure you have connected first.',
		});

	//create template
	const allTemplatesRes = await krispyAxios({
		method: 'GET',
		url: 'https://waba-v2.360dialog.io/v1/configs/templates',
		headers: {
			'D360-API-KEY': foundPreference.d360ApiKey,
		},
	});
	if (allTemplatesRes?.error)
		return res.status(500).json({
			msg: 'Error getting templates.',
			details: allTemplatesRes?.error,
		});

	//TEMPORARY - updates the status for templates
	for (let d360Template of allTemplatesRes.data?.waba_templates) {
		await Template.findOneAndUpdate(
			{
				$and: [
					{ entity: new ObjectId(entityId) },
					{ name: d360Template?.name },
					{ language: d360Template?.language },
				],
			},
			{
				$set: {
					status: d360Template?.status,
				},
			}
		);
	}
	const templates = await Template.find({
		entity: new ObjectId(entityId),
	}).toArray();
	return res.status(200).json({ templates: formatIds(templates, 'template') });
};

// @desc    Deletes a template
// @route   DELETE /api/templates/:templateId
// @access  PRIVATE
const deleteTemplate = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { templateId } = req.params;

	const foundPreference = await Preference.findOne({
		entity: new ObjectId(entityId),
	});
	if (!foundPreference?.d360ApiKey)
		return res.status(404).json({
			msg: 'No 360Dialog API Key found. Please make sure you have connected first.',
		});

	//template not found
	const foundTemplate = await Template.findOne({
		_id: new ObjectId(templateId),
		entity: new ObjectId(entityId),
	});
	if (!foundTemplate)
		return res.status(404).json({
			msg: 'Template not found.',
		});

	//template hooked with flow
	const foundHookedFlow = await Flow.findOne({
		'actions.template': new ObjectId(templateId),
	});
	if (foundHookedFlow)
		return res.status(400).json({
			msg: `Cannot delete this template as it is hooked with "${foundHookedFlow?.name}" flow!`,
		});

	//delete template from meta
	const deleteTemplateRes = await krispyAxios({
		method: 'DELETE',
		url: `https://waba-v2.360dialog.io/v1/configs/templates/${foundTemplate?.name}`,
		headers: {
			'D360-API-KEY': foundPreference.d360ApiKey,
		},
	});
	if (deleteTemplateRes?.error)
		return res.status(500).json({
			msg: 'Error deleting template.',
			details: deleteTemplateRes?.error,
		});
	//delete from db
	await Template.deleteOne({ _id: foundTemplate._id });
	return res
		.status(200)
		.json({ msg: 'Template deleted.', details: deleteTemplateRes });
};

module.exports = {
	addTemplate,
	getAllTemplates,
	deleteTemplate,
};

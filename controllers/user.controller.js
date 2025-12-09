const { getCollection } = require('../db');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateRandomString, formatIds } = require('../utils.js');
const { sendEmail } = require('../services/emailingService.js');
const { compile } = require('handlebars');
const fs = require('fs');
const { ObjectId, Double } = require('mongodb');

const User = getCollection('users');
const Entity = getCollection('entities');
const Preference = getCollection('preferences');
const KnowledgeBase = getCollection('knowledgeBases');
const Analytic = getCollection('analytics');
const Subscription = getCollection('subscriptions');

// @desc    Creates a new user and sends verification email
// @route   POST /api/users/sign-up?storeUri={SHOPIFY_STORE_URI}
// @access  PUBLIC
const signUpUser = async (req, res) => {
	const { storeUri } = req.query;
	const { businessName, firstName, lastName, email, password } = req.body;
	const userExists = await User.findOne({ email });
	//user already exists with this email
	if (userExists)
		return res
			.status(409)
			.json({ msg: 'User with this email already exists!' });

	//create entity
	const createdEntity = await Entity.insertOne({
		name: businessName,
	});
	//create preferences of entity
	const createdPreference = await Preference.insertOne({
		entity: createdEntity.insertedId,
		aiActive: true,
		shopifyConnectorKey: generateRandomString(30),
		onboardingStep: 0,
		brandVoice: {
			friendly: 50,
			emojis: 50,
			serious: 50,
			caring: 50,
		},
		optOutReplyMessage:
			"We've noted your request to stop marketing messages. Your preferences matter to us. If you ever decide to receive updates again, simply drop us any message here.",
	});
	//create knowledge base of entity
	const createdKnowledgeBase = await KnowledgeBase.insertOne({
		entity: createdEntity.insertedId,
		aboutUs: 'None',
		additionalInfo: 'None',
		address: '',
		city: '',
		currency: '',
		domain: '',
		email: '',
		jobId: '',
		phone: null,
		pineconeIndex: 'krispy',
		shopifyBlog: {
			completion: 0,
			embeddedList: [],
		},
		shopifyPolicy: {
			completion: 0,
			embeddedList: [],
		},
		shopifyProduct: {
			metadataTags: [],
			completion: 0,
			embeddedList: [],
		},
		storeName: '',
		zip: '',
	});
	//create analytic object
	const createdAnalytic = await Analytic.insertOne({
		entity: createdEntity.insertedId,
		shopifyAttributionRevenue: new Double(0.0),
	});
	//create user
	const hashedPassword = await bcrypt.hash(password, 6);
	const user = await User.insertOne({
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: hashedPassword,
		isVerified: false,
		permission: 'OWNER',
		entity: createdEntity?.insertedId,
	});
	//generate email verification token
	const emailVerificationToken = jwt.sign(
		{
			userId: user.insertedId,
		},
		process.env.EMAIL_VERIFICATION_JWT_SECRET
	);
	//generate email verification link
	let emailVerificationLink = `${process.env.CLIENT_BASE_URL}/verify-email/${emailVerificationToken}`;
	if (storeUri)
		emailVerificationLink += `?storeUri=${storeUri}&entityId=${createdEntity.insertedId.toString()}`;
	//load email verification html template
	const source = fs.readFileSync(
		`${process.cwd()}/templates/EmailVerificationTemplate.html`,
		'utf8'
	);
	const template = compile(source);
	const htmlToSend = template({
		emailVerificationLink,
	});
	// send email
	const { emailSent, error } = await sendEmail({
		to: email,
		subject: 'Verify your email',
		html: htmlToSend,
	});
	if (!emailSent) {
		//rollback user creation
		await Entity.findOneAndDelete({ _id: createdEntity.insertedId });
		await Preference.findOneAndDelete({ _id: createdPreference.insertedId });
		await KnowledgeBase.findOneAndDelete({
			_id: createdKnowledgeBase.insertedId,
		});
		await Analytic.findOneAndDelete({ _id: createdAnalytic.insertedId });
		await User.findOneAndDelete({ _id: user.insertedId });
		return res.status(500).json({
			msg: 'Something went wrong while sending the email. Please try again',
			details: error,
		});
	}
	return res.status(200).json({ msg: 'Email verification link sent!' });
};

// @desc    Logs in users
// @route   POST /api/users/log-in
// @access  PUBLIC
const logInUser = async (req, res) => {
	const { email, password } = req.body;

	const [user] = await User.aggregate([
		{ $match: { email } },
		{
			$lookup: {
				from: 'entities',
				localField: 'entity',
				foreignField: '_id',
				as: 'entity',
			},
		},
		{ $addFields: { entity: { $arrayElemAt: ['$entity', 0] } } },
		{ $limit: 1 },
	]).toArray();

	//no user found
	if (!user)
		return res.status(400).send({ msg: 'No user found with this email!' });

	//user email not verified
	if (!user.isVerified)
		return res.status(400).send({
			msg: 'Email not verified! Please verify the email you registered with before continuing.',
		});

	//incorrect password
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return res.status(400).send({ msg: 'Incorrect password!' });

	//all good
	const accessToken = jwt.sign(
		{
			userId: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			permission: user.permission,
			entity: {
				entityId: user.entity._id,
				name: user.entity.name,
			},
		},
		process.env.JWT_SECRET,
		{ expiresIn: '24h' }
	);
	return res.status(200).json({
		accessToken: accessToken,
		user: {
			userId: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			permission: user.permission,
			entity: {
				entityId: user.entity._id,
				name: user.entity.name,
			},
		},
	});
};

// @desc    Gets the current logged in user
// @route   GET /api/users/me
// @access  PRIVATE
const getCurrentUser = async (req, res) => {
	let userDetails;
	const [user] = await User.aggregate([
		{ $match: { _id: new ObjectId(req.user.userId) } },
		{
			$lookup: {
				from: 'entities',
				localField: 'entity',
				foreignField: '_id',
				as: 'entity',
			},
		},
		{ $addFields: { entity: { $arrayElemAt: ['$entity', 0] } } },
		{ $limit: 1 },
	]).toArray();
	if (!user) return res.status(404).json({ msg: 'User not found.' });

	//get subscription hookes wuth this user's business
	const [subscription] = await Subscription.aggregate([
		{
			$match: {
				entity: new ObjectId(user?.entity?._id),
				isActive: true,
			},
		},
		{
			$lookup: {
				from: 'pricingTiers',
				localField: 'pricingTier',
				foreignField: '_id',
				as: 'pricingTier',
			},
		},
		{ $addFields: { pricingTier: { $arrayElemAt: ['$pricingTier', 0] } } },
		{
			$project: {
				pricingTier: 1,
			},
		},
		{ $limit: 1 },
	]).toArray();

	if (subscription)
		userDetails = {
			...user,
			subscription,
		};
	else userDetails = user;

	return res.status(200).json({ user: formatIds(userDetails, 'user') });
};

// @desc    Send an email with link to reset password
// @route   POST /api/users/forgot-password
// @access  PUBLIC
const forgotPassword = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email: email });
	if (!user)
		return res.status(404).json({ msg: 'No user found with provided email.' });
	//generate token
	const resetPasswordToken = jwt.sign(
		{
			userId: user._id,
			email: user.email,
		},
		process.env.JWT_SECRET,
		{ expiresIn: 1200 } //20 minutes
	);
	//load reset password email html template
	const source = fs.readFileSync(
		`${process.cwd()}/templates/ResetPasswordTemplate.html`,
		'utf8'
	);
	const template = compile(source);
	const htmlToSend = template({
		resetPasswordLink: `${process.env.CLIENT_BASE_URL}/reset-password/${resetPasswordToken}`,
	});
	//send email
	const { emailSent, error } = await sendEmail({
		to: email,
		subject: 'Reset your password!',
		html: htmlToSend,
		text: `Use this link to reset your password: ${process.env.CLIENT_BASE_URL}/reset-password/${resetPasswordToken}.`,
	});
	if (!emailSent)
		return res.status(500).json({
			msg: 'Something went wrong while sending the email. Please try again',
			details: error,
		});
	return res
		.status(200)
		.json({ msg: 'Reset password link sent to provided email' });
};

// @desc    Resets the password of the user
// @route   POST /api/users/reset-password
// @access  PUBLIC
const resetPassword = async (req, res) => {
	const { newPassword, resetPasswordToken } = req.body;
	jwt.verify(resetPasswordToken, process.env.JWT_SECRET, async (err, user) => {
		if (err) return res.status(403).json({ msg: 'Link invalid or expired.' }); //invalid token
		//token is valid reset password
		const hashedPassword = await bcrypt.hash(newPassword, 6);
		await User.updateOne(
			{ _id: new ObjectId(user?.userId) },
			{ $set: { password: hashedPassword } }
		);
		return res.status(200).json({ msg: 'Password reset successful.' });
	});
};

// @desc    Updates the password of the user
// @route   POST /api/users/update-password
// @access  PRIVATE
const updatePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;
	const userId = req.user.userId;

	const foundUser = await User.findOne({ _id: new ObjectId(userId) });
	//incorrect password
	const isMatch = await bcrypt.compare(currentPassword, foundUser.password);
	if (!isMatch)
		return res.status(400).send({ msg: 'Current password does not match.' });

	const hashedPassword = await bcrypt.hash(newPassword, 6);
	await User.updateOne(
		{ _id: new ObjectId(userId) },
		{ $set: { password: hashedPassword } }
	);
	return res.status(200).json({ msg: 'Password updated.' });
};

// @desc    Sends email to verify user's acc
// @route   POST /api/users/verify-email
// @access  PUBLIC
const verifyUserEmail = async (req, res) => {
	const { emailVerificationToken } = req.body;
	jwt.verify(
		emailVerificationToken,
		process.env.EMAIL_VERIFICATION_JWT_SECRET,
		async (err, user) => {
			if (err) return res.status(403).json({ msg: 'Link invalid!' }); //invalid token
			//token is valid - verify email
			const foundUser = await User.findOne({ _id: new ObjectId(user?.userId) });
			if (!foundUser) return res.status(404).json({ msg: 'User not found.' });
			if (foundUser.isVerified)
				return res.status(409).json({ msg: 'Account already verified.' });
			await User.updateOne(
				{ _id: new ObjectId(user?.userId) },
				{ $set: { isVerified: true } }
			);
			return res.status(200).json({ msg: 'Account verified successfully!' });
		}
	);
};

// @desc    Logs in admin user
// @route   POST /api/users/admin/log-in
// @access  PUBLIC
const adminLogIn = async (req, res) => {
	const { email, password, entityId } = req.body;

	const foundEntity = await Entity.findOne({
		_id: new ObjectId(entityId),
	});

	if (!foundEntity) return res.status(404).json({ msg: 'No entity found.' });

	if (
		email !== process.env.ADMIN_EMAIL ||
		password !== process.env.ADMIN_PASSWORD
	)
		return res.status(400).json({ msg: 'Invalid credentials' });

	//all good
	const foundUser = await User.findOne({
		entity: new ObjectId(entityId),
	});

	const accessToken = jwt.sign(
		{
			userId: foundUser._id,
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			email: foundUser.email,
			permission: foundUser.permission,
			entity: {
				entityId: foundEntity._id,
				name: foundEntity.name,
			},
		},
		process.env.JWT_SECRET,
		{ expiresIn: '24h' }
	);
	return res.status(200).json({
		accessToken: accessToken,
		user: {
			userId: foundUser._id,
			firstName: foundUser.firstName,
			lastName: foundUser.lastName,
			email: foundUser.email,
			permission: foundUser.permission,
			entity: {
				entityId: foundEntity._id,
				name: foundEntity.name,
			},
		},
	});
};

module.exports = {
	signUpUser,
	logInUser,
	getCurrentUser,
	forgotPassword,
	resetPassword,
	updatePassword,
	verifyUserEmail,
	adminLogIn,
};

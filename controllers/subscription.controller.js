const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

const PricingTier = getCollection('pricingTiers');
const User = getCollection('users');
const Subscription = getCollection('subscriptions');

// @desc    Creates a checkout session for stripe
// @route   POST /api/subscriptions/checkout
// @access  PRIVATE
const checkoutSubscription = async (req, res) => {
	const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
	const entityId = req.user.entity.entityId;
	const { pricingTierId, successUrl, cancelUrl } = req.body;

	const foundTier = await PricingTier.findOne({
		_id: new ObjectId(pricingTierId),
	});
	if (!foundTier)
		return res.status(404).json({ msg: 'Pricing tier not found.' });

	const foundUser = await User.findOne({
		entity: new ObjectId(entityId),
	});

	//check if business already subscribed to this plan
	const foundSubscription = await Subscription.findOne({
		entity: new ObjectId(entityId),
		isActive: true,
		pricingTier: new ObjectId(pricingTierId),
	});
	if (foundSubscription)
		return res
			.status(409)
			.json({ msg: 'You are already subscribed to this plan.' });

	//creating checkout session
	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		customer_email: foundUser.email,
		line_items: [{ price: foundTier.externalPriceId }],
		client_reference_id: entityId,
		subscription_data: {
			// trial_period_days: 7,
			metadata: {
				entityId: entityId,
				pricingTierId: pricingTierId,
			},
		},
		success_url: successUrl,
		cancel_url: cancelUrl,
	});
	return res.status(201).json({ checkoutUrl: session.url });
};

module.exports = {
	checkoutSubscription,
};

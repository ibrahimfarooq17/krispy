const { getCollection } = require('../db');
const { formatIds } = require('../utils');

const PricingTier = getCollection('pricingTiers');

// @desc    Gets all pricingTiers
// @route   GET /api/pricing-tiers
// @access  PRIVATE
const getAllPricingTiers = async (req, res) => {
	const pricingTiers = await PricingTier.find({}).toArray();
	return res.status(200).json({
		pricingTiers: formatIds(pricingTiers, 'pricingTier'),
	});
};

module.exports = {
	getAllPricingTiers,
};

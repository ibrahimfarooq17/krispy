const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { formatIds, krispyAxios } = require('../utils');
const { embedUrlForScraping, embedText, updateEmbedding, deleteEmbedding } = require('../services/aiService');

const KnowledgeBase = getCollection('knowledgeBases');

// @desc    Gets the knowledge base of the entity
// @route   GET /api/knowledge-bases
// @access  PUBLIC
const getKnowledgeBase = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const foundKnowledgeBase = await KnowledgeBase.findOne({
    entity: new ObjectId(entityId)
  });
  return res.status(200).json({
    knowledgeBase: foundKnowledgeBase
  });
};

// @desc    Updates the knowledge base of the entity
// @route   PATCH /api/knowledge-bases
// @access  PUBLIC
const updateKnowledgeBase = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const {
    additionalInfo,
    aboutUs,
    scrapingUrl,
    systemPrompt,
    aiName
  } = req.body;

  const foundKnowledgeBase = await KnowledgeBase.findOne({
    entity: new ObjectId(entityId)
  });

  //scrape url
  if (scrapingUrl) {
    const urlScrapingRes = await embedUrlForScraping({
      url: scrapingUrl,
      entityId: entityId
    })
    if (urlScrapingRes.error)
      return res.status(500).json({ msg: "Error scraping url.", details: urlScrapingRes.error });
  }

  //embed about us if updated
  // if (aboutUs && aboutUs !== foundKnowledgeBase?.aboutUs) {
  //   const aboutUsEmbeddingRes = await embedText({
  //     text: aboutUs,
  //     entityId
  //   });
  //   if (aboutUsEmbeddingRes.error)
  //     return res.status(500).json({
  //       msg: "Error embedding about us.",
  //       details: aboutUsEmbeddingRes.error
  //     });
  // }

  //embed additional info if updated
  if (additionalInfo && additionalInfo !== foundKnowledgeBase?.additionalInfo) {
    const additionalInfoEmbeddingRes = await embedText({
      text: additionalInfo,
      entityId
    });
    if (additionalInfoEmbeddingRes.error)
      return res.status(500).json({
        msg: "Error embedding additional info.",
        details: additionalInfoEmbeddingRes.error
      });
  }

  await KnowledgeBase.updateOne(
    { entity: new ObjectId(entityId) },
    {
      $set: {
        ...(additionalInfo && { additionalInfo }),
        ...(aboutUs && { aboutUs }),
        ...(systemPrompt && { systemPrompt }),
        ...(aiName && { aiName }),
      },
      ...(scrapingUrl && {
        $push: {
          scrapingUrls: scrapingUrl
        }
      }),
    }
  );
  return res.status(200).json({ msg: 'Knowledge base updated.' })
};

// @desc    Update details of shopify product in knowledge base
// @route   PATCH /api/knowledge-bases/shopify/products/:productId
// @access  PRIVATE
const updateShopifyProduct = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { productId } = req.params;
  const {
    productUrl
  } = req.body;

  const foundKnowledgeBase = await KnowledgeBase.findOne({
    entity: new ObjectId(entityId)
  });

  //find product in knowledge base
  const foundProduct = foundKnowledgeBase?.shopifyProduct?.embeddedList?.find(
    product => parseInt(product?.id) == parseInt(productId)
  );
  if (!foundProduct)
    return res.status(404).json({
      msg: 'Product with provided id not found.'
    });

  //update details in embedding
  const { error } = await updateEmbedding({
    entityId,
    embeddingIds: foundProduct?.embedding_ids,
    metadata: {
      url: productUrl
    }
  });
  if (error)
    return res.status(500).json({
      msg: 'Error updating embedding.',
      details: error
    });

  //update details in DB
  await KnowledgeBase.updateOne(
    {
      _id: new ObjectId(foundKnowledgeBase._id),
      'shopifyProduct.embeddedList.id': parseInt(productId)
    },
    {
      $set: {
        'shopifyProduct.embeddedList.$.product_url': productUrl
      }
    }
  );
  return res.status(200).json({ msg: 'Knowledge base updated.' })
};

// @desc    Delete shopify product in knowledge base
// @route   DELETE /api/knowledge-bases/shopify/products/:productId
// @access  PRIVATE
const deleteShopifyProduct = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { productId } = req.params;

  const foundKnowledgeBase = await KnowledgeBase.findOne({
    entity: new ObjectId(entityId)
  });

  //find product in knowledge base
  const foundProduct = foundKnowledgeBase?.shopifyProduct?.embeddedList?.find(
    product => parseInt(product?.id) == parseInt(productId)
  );
  if (!foundProduct)
    return res.status(404).json({
      msg: 'Product with provided id not found.'
    });

  //delete product embedding
  const { error } = await deleteEmbedding({
    entityId,
    embeddingIds: foundProduct?.embedding_ids,
  });
  if (error)
    return res.status(500).json({
      msg: 'Error deleting embedding.',
      details: error
    });

  //update details in DB
  await KnowledgeBase.updateOne(
    {
      _id: new ObjectId(foundKnowledgeBase._id),
      // 'shopifyProduct.embeddedList.id': parseInt(productId)
    },
    {
      $pull: {
        'shopifyProduct.embeddedList': {
          id: parseInt(productId)
        }
      }
      // $pull: {
      //   'shopifyProduct.embeddedList.id': parseInt(productId)
      // }
      // $set: {
      //   'shopifyProduct.embeddedList.$.product_url': productUrl
      // }
    }
  );
  return res.status(200).json({ msg: 'Knowledge base updated. Product deleted.' })
};

module.exports = {
  getKnowledgeBase,
  updateKnowledgeBase,
  updateShopifyProduct,
  deleteShopifyProduct
};

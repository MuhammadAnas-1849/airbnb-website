const Joi = require("joi");

module.exports.listingSchemaJoi = Joi.object({
  Listing: Joi
    .object({
      title: Joi.string().required(),
      select: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      country: Joi.string().required(),
      price: Joi.string().required().min(0),
      image:Joi.object({url: Joi.string().allow("", null),})
    })
    .required(),
});

module.exports.reviewSchemaJoi = Joi.object({
  review: Joi
    .object({
      rating: Joi.number().required().min(1).max(5),
      comment: Joi.string().required(),
    })
    .required(),
});


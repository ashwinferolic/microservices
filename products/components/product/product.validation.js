const Joi = require("joi");

// product register schema
const addProductSchema = Joi.object({
  productName: Joi.string().required(),
  productCode: Joi.string()
    .regex(/^\d+$/)
    .message("Please enter a numeric value for ProductCode")
    .required(),
  dosageForm: Joi.string().valid("tablet", "injection").required(),
  packingForm: Joi.string()
    .valid("strip", "ampoule", "vial", "bottle")
    .required(),
  packingSize: Joi.number().required(),
  weight: Joi.string()
    .regex(/^\d+$/)
    .allow("TBD")
    .message("Enter any numbers or TBD for weight")
    .insensitive()
    .required(),
  molecules: Joi.string().required(),
  saltGroup: Joi.string().required(),
  MRP: Joi.number().required(),
  priceToCustomer: Joi.number().required(),
  discountFromMRP: Joi.number().required(),
  taxPercentage: Joi.number().required(),
  stock: Joi.boolean(),
  prescriptionRequired: Joi.boolean(),
  discount: Joi.array().required(),
  images: Joi.array(),
});

// product register schema
const productSchema = Joi.object({
  productName: Joi.string(),
  productCode: Joi.string()
    .regex(/^\d+$/)
    .message("Please enter a numeric value for ProductCode"),
  dosageForm: Joi.string().valid("tablet", "injection"),
  packingForm: Joi.string().valid("strip", "ampoule", "vial", "bottle"),
  packingSize: Joi.number(),
  weight: Joi.string()
    .regex(/^\d+$/)
    .allow("TBD")
    .message("Enter any numbers or TBD")
    .insensitive(),
  molecules: Joi.string(),
  saltGroup: Joi.string(),
  MRP: Joi.number(),
  priceToCustomer: Joi.number(),
  discountFromMRP: Joi.number(),
  taxPercentage: Joi.number(),
  stock: Joi.boolean(),
  prescriptionRequired: Joi.boolean(),
  discount: Joi.array(),
  images: Joi.array(),
});

const productDataSchema = Joi.object({
  _id: Joi.string(),
  productName: Joi.string(),
  productCode: Joi.number(),
  dosageForm: Joi.string().valid("tablet", "injection"),
  packingForm: Joi.string().valid("strip", "ampoule", "vial", "bottle"),
  packingSize: Joi.number(),
  weight: Joi.string()
    .regex(/^\d+$/)
    .allow("TBD")
    .message("Enter any numbers or TBD")
    .insensitive(),
  molecules: Joi.string(),
  saltGroup: Joi.string(),
  MRP: Joi.number(),
  priceToCustomer: Joi.number(),
  discountFromMRP: Joi.number(),
  taxPercentage: Joi.number(),
  stock: Joi.boolean(),
  prescriptionRequired: Joi.boolean(),
  discount: Joi.string(),
  images: Joi.string(),
});

const validateProductList = async (req, res, next) => {
  try {
    let data = req.body.data;
    for (let item of data) {
      await productDataSchema.validateAsync(item);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProductSchema,
  productSchema,
  validateProductList,
  productDataSchema,
};

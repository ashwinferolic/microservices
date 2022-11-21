const Joi = require("joi");

const addorderSchema = Joi.object({
  products: Joi.array()
    .required()
    .min(1)
    .items(
      Joi.object({
        product: Joi.string().required(),
      })
    ),
  orderDate: Joi.date(),
  orderType: Joi.string()
    .required()
    .valid("cart flow", "upload rx")
    .insensitive(),
  status: Joi.string()
    .required()
    .valid("new request", "under process", "order confirmed", "completed")
    .insensitive(),
  newUser: Joi.boolean().default(true),
  prescription: Joi.object().required().keys({
    doctorName: Joi.string().required(),
    patientName: Joi.string().required(),
    refillDays: Joi.number().required(),
    reviewed: Joi.boolean(),
    images: Joi.array(),
  }),
  payment: Joi.object()
    .required()
    .keys({
      cartValue: Joi.number().required(),
      deliveryCharge: Joi.number().required(),
      total: Joi.number().required(),
      type: Joi.string()
        .valid("wallet", "cod", "netbanking", "mock")
        .insensitive()
        .required(),
    }),
});

const updateOrderSchema = Joi.object({
  status: Joi.string().valid(
    "new request",
    "under process",
    "order confirmed",
    "completed"
  ),
  newUser: Joi.boolean(),
  prescription: Joi.object().keys({
    doctorName: Joi.string().required(),
    patientName: Joi.string().required(),
    refillDays: Joi.number().required(),
    reviewed: Joi.boolean(),
    images: Joi.array(),
  }),
});

module.exports = { addorderSchema, updateOrderSchema };

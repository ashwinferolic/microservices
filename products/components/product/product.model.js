const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
  },
  productCode: {
    type: String,
  },
  dosageForm: {
    type: String,
  },
  packingForm: {
    type: String,
  },
  packingSize: {
    type: Number,
  },
  weight: {
    type: String,
  },
  molecules: {
    type: String,
  },
  saltGroup: {
    type: String,
  },
  MRP: {
    type: Number,
  },
  priceToCustomer: {
    type: Number,
  },
  discountFromMRP: {
    type: Number,
  },
  taxPercentage: {
    type: Number,
  },
  stock: {
    type: Boolean,
    default: true,
  },
  prescriptionRequired: {
    type: Boolean,
    default: true,
  },
  discount: {
    type: Array,
  },
  images: {
    type: Array,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

const express = require("express");
const router = express.Router();
const { getJsonData, uploadFile } = require("../../utils/upload");
const { validate, validateList } = require("../../middleware/joi.middleware");
const {
  addProductSchema,
  productSchema,
  productDataSchema,
} = require("./product.validation");
const {
  addProduct,
  listProducts,
  deleteProductsList,
  getProductById,
  deleteProductById,
  editProductById,
  searchProducts,
  uploadProducts,
  exportProducts,
} = require("./product.controller");

// add, list products
router.post("/add", validate(addProductSchema), addProduct);
router.get("/list", listProducts);
router.delete("/list", deleteProductsList);

router.get("/search", searchProducts);
// upload products
router.post(
  "/bulk-upload",
  uploadFile.single("data"),
  getJsonData,
  validateList(productDataSchema),
  uploadProducts
);
router.get("/export-data", exportProducts);

// get product by id
router.get("/details/:id", getProductById);
router.put("/details/:id", validate(productSchema), editProductById);
router.delete("/details/:id", deleteProductById);

module.exports = router;

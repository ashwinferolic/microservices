const express = require("express");
const router = express.Router();
const { validate } = require("../../middleware/joi.middleware");
const { protected } = require("../../utils/token");
const { addorderSchema, updateOrderSchema } = require("./order.validation");
const {
  addOrder,
  getOrderById,
  getOrdersList,
  cancelOrder,
  getUserIds,
  getUserDetails,
} = require("./order.controller");

router.post("/add", protected, validate(addorderSchema), addOrder);
router.get("/list", protected, getOrdersList);
// get and cancel orders
router.get("/details/:id", protected, getOrderById);
router.delete("/details/:id", protected, cancelOrder);

// admin
router.get("/admin/users-list", protected, getUserIds);
router.post("/admin/orders-details", protected, getUserDetails);

module.exports = router;

const moment = require("moment");
const Order = require("./order.model");

// add order service
const addOrderService = async (req, res, next) => {
  try {
    let data = await Order.create({
      user: req.user.id,
      products: req.body.products,
      orderedDate: moment(), // order timing will be in utc, because of mongoose atlas server
      orderType: req.body.orderType,
      duration: req.body.duration,
      status: req.body.status,
      prescription: req.body.prescription,
      payment: req.body.payment,
    });
    return data;
  } catch (error) {
    next(error);
  }
};

// get order by id service
const getOrderByIdService = async (req, res, next) => {
  try {
    let data = await Order.findOne({
      $and: [{ _id: req.params.id }, { user: req.user.id }],
    });
    return data;
  } catch (error) {
    next(error);
  }
};

// get list of orders for the logged in user
const getOrdersListService = async (req, res, next) => {
  try {
    let data = await Order.find({ user: req.user.id });
    return data || [];
  } catch (error) {
    next(error);
  }
};

// cancel order
const cancelOrderByIdService = async (req, res, next) => {
  try {
    return await Order.findOneAndDelete({
      $and: [{ _id: req.params.id }, { user: req.user.id }],
    });
  } catch (error) {
    next(error);
  }
};

// get list of order id's
const getOrderListService = async (req, res, next) => {
  try {
    let data = await Order.find({});
    return data;
  } catch (error) {
    next(error);
  }
};

// admin
// get order by id
const getOrderService = async (req, res, next) => {
  try {
    let data = await Order.findOne({
      $and: [{ _id: req.params.id }, { user: req.user.id }],
    });
    return data;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrderService,
  getOrderByIdService,
  getOrdersListService,
  cancelOrderByIdService,
  getOrderListService,
  getOrderService,
};

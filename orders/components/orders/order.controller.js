const createError = require("http-errors");
const {
  addOrderService,
  getOrdersListService,
  cancelOrderByIdService,
  getOrderListService,
  getOrderService,
} = require("./order.service");
const {
  getOrderByIdInterService,
} = require("../../interservices/order.interservice");
const { API } = require("../../interservices/config");

// add order
const addOrder = async (req, res, next) => {
  try {
    let order = await addOrderService(req, res, next);
    if (order) {
      return res
        .status(201)
        .json({ message: "Order have been created!", order });
    }
  } catch (error) {
    next(error);
  }
};

// get order by id
const getOrderById = async (req, res, next) => {
  try {
    let order = await getOrderByIdInterService(req, res, next);
    if (order) {
      return res.status(200).json(order);
    } else {
      return next(createError(404, "order not found for the logged in user"));
    }
  } catch (error) {
    next(error);
  }
};

// list order
const getOrdersList = async (req, res, next) => {
  try {
    let data = await getOrdersListService(req, res, next);
    if (data) {
      return res.status(200).json(data);
    } else {
      return next(createError(404, "Order not found for the logged in user"));
    }
  } catch (error) {
    next(error);
  }
};

// cancel order
const cancelOrder = async (req, res, next) => {
  try {
    let order = await cancelOrderByIdService(req, res, next);
    if (order) {
      return res
        .status(202)
        .json({ message: "Order have been cancelled!", order: order._id });
    } else {
      return next(createError(404, "Order not found for the logged in user"));
    }
  } catch (error) {
    next(error);
  }
};

// admin
// get user id from order list
const getUserIds = async (req, res, next) => {
  try {
    if (req.user.role != "admin") {
      return next(createError(401, "Only admin can access the route"));
    }
    let data = await getOrderListService(req, res, next);
    if (data) {
      let result = data.map((a) => a.user);
      return res
        .status(200)
        .json({ message: "List of ordered user id's", data: result });
    }
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    let orders = await getOrderService(req, res, next);
    if (orders) {
      // user promise
      let promise = orders.map(async (order) => {
        let user = await API.getUser(order.user);
        order.user = user;
        order.user.password = null;

        // product promise
        let products = order.products.map(async (item) => {
          let productdata = await API.getProduct(item.product);
          item.product = productdata;
        });
        await Promise.all(products).then((a) => a);
        return order;
      });

      let data = await Promise.all(promise).then((a) => a);
      return res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrder,
  getOrderById,
  getOrdersList,
  cancelOrder,
  getUserIds,
  getOrderDetails,
};

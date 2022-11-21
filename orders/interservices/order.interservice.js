const { getOrderByIdService } = require("../components/orders/order.service");
const { API } = require("./config");

const getOrderByIdInterService = async (req, res, next) => {
  try {
    let order = await getOrderByIdService(req, res, next);

    if (order) {
      // fetching users
      let user = await API.getUser(req.user.id);
      order.user = user;
      order.user.password = null;

      // fetching products
      let getProductDetails = order.products.map(
        async (item) => await API.getProduct(item.product)
      );
      let productList = await Promise.all(getProductDetails).then((d) => [
        ...d,
      ]);
      order.products = productList;
      return order;
    }
    return order;
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrderByIdInterService };

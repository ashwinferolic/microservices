const createError = require("http-errors");
const {
  existsProductService,
  addProductService,
  listProductsService,
  deleteProductsListService,
  getProductByIdService,
  deleteProductByIdService,
  editProductByIdService,
  searchProductService,
  uploadExistProductService,
  uploadProductService,
} = require("./product.service");
const XLSX = require("xlsx");
const path = require("path");

// add product
const addProduct = async (req, res, next) => {
  try {
    const existProduct = await existsProductService(req, res, next);
    if (existProduct) {
      next(createError(400, "Product already exists"));
    } else {
      const product = await addProductService(req, res, next);
      if (product) {
        return res.status(201).json(product);
      }
    }
  } catch (error) {
    next(error);
  }
};

// list products
const listProducts = async (req, res, next) => {
  try {
    const data = await listProductsService(req, res, next);
    if (data) {
      return res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
};

// delete products
const deleteProductsList = async (req, res, next) => {
  try {
    const data = await deleteProductsListService(req, res, next);
    if (data) {
      return res
        .status(202)
        .json({ message: "Product list have been deleted", data });
    }
  } catch (error) {
    next(error);
  }
};

// get product by id
const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req, res, next);
    if (product) {
      return res.status(200).json(product);
    } else {
      next(createError(404, "Product not found /api/products/id"));
    }
  } catch (error) {
    next(error);
  }
};

// edit product by id
const editProductById = async (req, res, next) => {
  try {
    const product = await editProductByIdService(req, res, next);
    if (product) {
      return res
        .status(200)
        .json({ message: "Product have been updated", product });
    } else {
      next(createError(404, "Product not found /api/products/id"));
    }
  } catch (error) {
    next(error);
  }
};

// delete product by id
const deleteProductById = async (req, res, next) => {
  try {
    const product = await deleteProductByIdService(req, res, next);
    if (product) {
      return res
        .status(202)
        .json({ message: "Product have been deleted", product: product._id });
    } else {
      next(createError(404, "Product not found /api/products/id"));
    }
  } catch (error) {
    next(error);
  }
};

// search products
const searchProducts = async (req, res, next) => {
  try {
    const data = await searchProductService(req, res, next);
    if (data) {
      return res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
};

// upload data to db
const uploadProducts = async (req, res, next) => {
  try {
    const productList = req.body.data;
    for (const product of productList) {
      // converting string to an img array
      product.images = product.images.split(",");
      product.discount = product.discount.split(",");
      req.body.product = product;
      if (!product._id) {
        await uploadProductService(req, res, next);
      } else {
        await uploadExistProductService(req, res, next);
      }
    }
    return res.status(201).json({ message: "Product List have been uploaded" });
  } catch (error) {
    next(error);
  }
};

// export data
const exportProducts = async (req, res, next) => {
  try {
    const data = await listProductsService(req, res, next);
    const wb = XLSX.utils.book_new();
    // converts js object to json
    let products = JSON.stringify(data);
    // convert js to object
    products = JSON.parse(products);

    // converting array to strings to store it in excel sheet
    products.map((product) => {
      product.discount = product.discount.toString();
      product.images = product.images.toString();
    });

    const ws = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    const file = path.resolve("downloads", "data.xlsx");
    XLSX.writeFile(wb, file);
    return res.status(201).json({ message: "Excel sheet exported" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  listProducts,
  deleteProductsList,
  getProductById,
  deleteProductById,
  editProductById,
  searchProducts,
  uploadProducts,
  exportProducts,
};

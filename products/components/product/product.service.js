const Product = require("./product.model");
const { paginate } = require("../../utils/paginate");
const createError = require("http-errors");
// check if product exists
const existsProductService = async (req, res, next) => {
  try {
    let data = await Product.findOne({ productName: req.body.productName });
    return data;
  } catch (error) {
    next(error);
  }
};

// add product
const addProductService = async (req, res, next) => {
  try {
    const data = await Product.create({
      productName: req.body.productName,
      productCode: req.body.productCode,
      dosageForm: req.body.dosageForm,
      packingForm: req.body.packingForm,
      packingSize: req.body.packingSize,
      weight: req.body.weight,
      molecules: req.body.molecules,
      saltGroup: req.body.saltGroup,
      MRP: req.body.MRP,
      priceToCustomer: req.body.priceToCustomer,
      discountFromMRP: req.body.discountFromMRP,
      taxPercentage: req.body.taxPercentage,
      stock: req.body.stock,
      prescriptionRequired: req.body.prescriptionRequired,
      discount: req.body.discount,
      images: req.body.images,
    });
    return data;
  } catch (error) {
    next(error);
  }
};

// list products
const listProductsService = async (req, res, next) => {
  try {
    let data = await Product.find();
    return data;
  } catch (error) {
    next(error);
  }
};

// delete products
const deleteProductsListService = async (req, res, next) => {
  try {
    await Product.deleteMany();
    let data = await Product.find();
    return data;
  } catch (error) {
    next(error);
  }
};

// get product by id
const getProductByIdService = async (req, res, next) => {
  try {
    let data = await Product.findById(req.params.id);
    return data;
  } catch (error) {
    next(error);
  }
};

// delete product by id
const deleteProductByIdService = async (req, res, next) => {
  try {
    let data = await Product.findByIdAndDelete(req.params.id);
    return data;
  } catch (error) {
    next(error);
  }
};

// edit product by id
const editProductByIdService = async (req, res, next) => {
  try {
    const data = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          productName: req.body.productName,
          productCode: req.body.productCode,
          dosageForm: req.body.dosageForm,
          packingForm: req.body.packingForm,
          packingSize: req.body.packingSize,
          weight: req.body.weight,
          molecules: req.body.molecules,
          saltGroup: req.body.saltGroup,
          MRP: req.body.MRP,
          priceToCustomer: req.body.priceToCustomer,
          discountFromMRP: req.body.discountFromMRP,
          taxPercentage: req.body.taxPercentage,
          stock: req.body.stock,
          prescriptionRequired: req.body.prescriptionRequired,
          discount: req.body.discount,
          images: req.body.images,
        },
      },
      { new: true }
    );
    return data;
  } catch (error) {
    next(error);
  }
};

// search products service
const searchProductService = async (req, res, next) => {
  try {
    if (!req.query.productCode && !req.query.productName) {
      next(createError(400, "productCode or productName query not exists"));
    }

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 2;
    let start = (page - 1) * limit;
    let totalCount = await Product.find({
      $or: [
        { productName: { $regex: `${req.query.productName}`, $options: "i" } },
        { productCode: { $regex: `${req.query.productCode}`, $options: "i" } },
      ],
    }).countDocuments();

    let productsList = await Product.find({
      $or: [
        { productName: { $regex: `${req.query.productName}`, $options: "i" } },
        { productCode: { $regex: `${req.query.productCode}`, $options: "i" } },
      ],
    })
      .skip(start)
      .limit(limit);

    let data = paginate(productsList, page, limit, totalCount);
    return data;
  } catch (error) {
    next(error);
  }
};

// upload excel data to db
const uploadProductService = async (req, res, next) => {
  try {
    let product = req.body.product;
    const data = await Product.create({
      productName: product.productName,
      productCode: product.productCode,
      dosageForm: product.dosageForm,
      packingForm: product.packingForm,
      packingSize: product.packingSize,
      weight: product.weight,
      molecules: product.molecules,
      saltGroup: product.saltGroup,
      MRP: product.MRP,
      priceToCustomer: product.priceToCustomer,
      discountFromMRP: product.discountFromMRP,
      taxPercentage: product.taxPercentage,
      stock: product.stock,
      prescriptionRequired: product.prescriptionRequired,
      discount: product.discount,
      images: product.images,
    });
    return data;
  } catch (error) {
    next(error);
  }
};

// update exists excel data to db
const uploadExistProductService = async (req, res, next) => {
  try {
    let product = req.body.product;
    const data = await Product.findOneAndUpdate(
      { _id: product._id },
      {
        $set: {
          productName: product.productName,
          productCode: product.productCode,
          dosageForm: product.dosageForm,
          packingForm: product.packingForm,
          packingSize: product.packingSize,
          weight: product.weight,
          molecules: product.molecules,
          saltGroup: product.saltGroup,
          MRP: product.MRP,
          priceToCustomer: product.priceToCustomer,
          discountFromMRP: product.discountFromMRP,
          taxPercentage: product.taxPercentage,
          stock: product.stock,
          prescriptionRequired: product.prescriptionRequired,
          discount: product.discount,
          images: product.images,
        },
      }
    );
    return data;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  existsProductService,
  addProductService,
  listProductsService,
  deleteProductsListService,
  getProductByIdService,
  deleteProductByIdService,
  editProductByIdService,
  searchProductService,
  uploadProductService,
  uploadExistProductService,
};

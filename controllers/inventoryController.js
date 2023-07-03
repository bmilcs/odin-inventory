const asyncHandler = require("express-async-handler");

const Product = require("../models/product");
const Category = require("../models/category");

//
// READ PRODUCTS
//

// GET inventory stats / main homepage
exports.index = asyncHandler(async (req, res, next) => {
  const [numProducts, numCategories] = await Promise.all([
    Product.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    productCount: numProducts,
    categoryCount: numCategories,
  });
});

// GET all products in the inventory
exports.all = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find({}, "name category price quantity")
    .populate("category")
    .sort({ category: 1, name: 1 })
    .exec();

  res.render("allProducts", { allProducts });
});

// GET a product's details by id
exports.productById = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  // mongodb queries with an _id.length > 24 chars immediately throw an error,
  // preventing the product === null conditional below from running
  const product =
    productId.length <= 24
      ? await Product.findById(productId).populate("category").exec()
      : null;

  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("product", { product: product });
});

//
// CREATE PRODUCTS
//

// GET create product form
exports.createProductGet = asyncHandler(async (req, res, next) => {
  res.send("create product: form render");
});

// POST create product in db
exports.createProductPost = asyncHandler(async (req, res, next) => {
  res.send("create product: perform create");
});

//
// UPDATE PRODUCTS
//

// GET update product form
exports.updateProductGet = asyncHandler(async (req, res, next) => {
  res.send("update product: form render");
});

// POST update product in db
exports.updateProductPost = asyncHandler(async (req, res, next) => {
  res.send("update product: perform update");
});

//
// DELETE PRODUCTS
//

// GET delete product form
exports.deleteProductGet = asyncHandler(async (req, res, next) => {
  res.send("delete product: form render");
});

// POST delete product in db
exports.deleteProductPost = asyncHandler(async (req, res, next) => {
  res.send("delete product: perform delete");
});

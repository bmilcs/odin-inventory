const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Category = require("../models/category");
const Product = require("../models/product");

//
// READ CATEGORIES
//

// GET categories all view / homepage
exports.all = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).exec();
  res.render("allCategories", { categories });
});

// GET category details by id
exports.categoryById = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  // mongodb queries that are given an invalid id immediately throw an error,
  // preventing the product === null conditional below from running
  const [category, products] = await Promise.all([
    mongoose.Types.ObjectId.isValid(categoryId)
      ? await Category.findById(categoryId).exec()
      : null,
    mongoose.Types.ObjectId.isValid(categoryId)
      ? await Product.find(
          { category: categoryId },
          "name price quantity",
        ).exec()
      : null,
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category", { category, products });
});

//
// CREATE PRODUCTS
//

// GET create category form
exports.createCategoryGet = asyncHandler(async (req, res, next) => {
  res.send("create category: form render");
});

// POST create category in db
exports.createCategoryPost = asyncHandler(async (req, res, next) => {
  res.send("create category: perform create");
});

//
// UPDATE PRODUCTS
//

// GET update category form
exports.updateCategoryGet = asyncHandler(async (req, res, next) => {
  res.send("update category: form render");
});

// POST update category in db
exports.updateCategoryPost = asyncHandler(async (req, res, next) => {
  res.send("update category: perform update");
});

//
// DELETE PRODUCTS
//

// GET delete category form
exports.deleteCategoryGet = asyncHandler(async (req, res, next) => {
  res.send("delete category: form render");
});

// POST delete category in db
exports.deleteCategoryPost = asyncHandler(async (req, res, next) => {
  res.send("delete category: perform delete");
});

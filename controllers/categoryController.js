const asyncHandler = require("express-async-handler");

const Category = require("../models/category");

//
// READ CATEGORIES
//

// GET categories all view / homepage
exports.all = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).exec();
  res.send(allCategories);
});

// GET category details by id
exports.categoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  res.send(category);
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

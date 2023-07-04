const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const Category = require("../models/category");
const Product = require("../models/product");

//
// READ CATEGORIES
//

// GET categories all view / homepage
exports.all = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).sort({ name: 1 }).exec();
  res.render("categoryList", { categories });
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
          "name price quantity image",
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
  res.render("categoryForm", {
    title: "Create A Category",
    category: { name: "", description: "" },
    errors: [],
  });
});

// POST create category in db
exports.createCategoryPost = [
  // validate and sanitize fields
  body("name", "Category name must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "description",
    "Category description must be at least 10 characters long.",
  )
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // extract validation errors from request
    const errors = validationResult(req);

    // create new category object with sanitized data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    // there are errors, render form again with sanitized values/error messages
    if (!errors.isEmpty()) {
      res.render("categoryForm", {
        title: "Create A Category",
        category,
        errors: errors.array(),
      });
      return;
    }

    // data from form is valid
    // make sure category with same name doesn't already exist
    const existingCategory = await Category.findOne({
      name: req.body.name,
    }).exec();

    if (existingCategory) {
      res.redirect(existingCategory.url);
      return;
    }

    // save category to db
    await category.save();
    res.redirect(category.url);
  }),
];

//
// UPDATE PRODUCTS
//

// GET update category form
exports.updateCategoryGet = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = mongoose.Types.ObjectId.isValid(categoryId)
    ? await Category.findById({ _id: categoryId }).exec()
    : null;

  res.render("categoryForm", {
    title: "Update Category",
    category,
    errors: [],
  });
});

// POST update category in db
exports.updateCategoryPost = [
  // validate and sanitize fields
  body("name", "Category name must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "description",
    "Category description must be at least 10 characters long.",
  )
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // extract validation errors from request
    const errors = validationResult(req);

    // create new category object with sanitized data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    // there are errors, render form again with sanitized values/error messages
    if (!errors.isEmpty()) {
      res.render("categoryForm", {
        title: "Update A Category",
        category,
        errors: errors.array(),
      });
      return;
    }

    // data from form is valid, update existing category with new data
    await Category.findByIdAndUpdate(req.params.id, category).exec();
    res.redirect(category.url);
  }),
];

//
// DELETE PRODUCTS
//

// GET delete category form
exports.deleteCategoryGet = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const [category, products] = await Promise.all([
    mongoose.Types.ObjectId.isValid(categoryId)
      ? await Category.findById({ _id: categoryId }).exec()
      : null,
    mongoose.Types.ObjectId.isValid(categoryId)
      ? await Product.find({ category: categoryId }).exec()
      : null,
  ]);

  res.render("categoryDelete", { category, products });
});

// POST delete category in db
exports.deleteCategoryPost = asyncHandler(async (req, res, next) => {
  const [category, products] = await Promise.all([
    mongoose.Types.ObjectId.isValid(req.params.id)
      ? await Category.findById({ _id: req.params.id }).exec()
      : null,
    mongoose.Types.ObjectId.isValid(req.params.id)
      ? await Product.find({ category: req.params.id }).exec()
      : null,
  ]);

  if (products.length > 0) {
    // category has products, render form again with products
    res.render("categoryDelete", { category, products });
    return;
  }

  // category has no products, delete category
  await Category.findByIdAndRemove(req.params.id).exec();
  res.redirect("/categories/all");
});

const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { validationResult, body } = require("express-validator");
const Product = require("../models/product");
const Category = require("../models/category");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// configure multer storage for photo uploads
const imageFileFilter = function (req, file, cb) {
  // no file present, continue without an error
  if (!file) {
    return cb(null, true);
  }

  // check if the file is an image
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed."), false);
  }

  // if the file is an image, continue without an error
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: function (req, file, cb) {
    // no file is present, continue without generating a filename
    if (!file) {
      return cb(null, "");
    }

    // generate a unique filename with the original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalExtension = file.originalname.split(".").pop();
    const filename =
      file.fieldname + "-" + uniqueSuffix + "." + originalExtension;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

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
  const products = await Product.find({}, "name category price quantity image")
    .populate("category")
    .sort({ category: 1, name: 1 })
    .exec();

  res.render("productList", { products });
});

// GET a product's details by id
exports.productById = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  // mongodb queries that are given an invalid id immediately throw an error,
  // preventing the product === null conditional below from running
  const product = mongoose.Types.ObjectId.isValid(productId)
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
  const categories = await Category.find({}).exec();
  res.render("productForm", {
    title: "Create Product",
    categories,
    product: null,
    errors: [],
  });
});

// POST create product in db
exports.createProductPost = [
  upload.single("image"),

  body("name", "Name must be at least 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must be at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("price", "Price must be a number").trim().isNumeric().escape(),
  body("quantity", "Quantity must be a number").trim().isNumeric().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.file ? `/images/${req.file.filename}` : null,
    });

    // if there are errors, render the form with sanitized values / error messages
    if (!errors.isEmpty()) {
      const categories = await Category.find({}).exec();
      res.render("productForm", {
        title: "Create Product",
        categories,
        product,
        errors: errors.array(),
      });
    }

    // if product with same name already exists, redirect user back to form w/ error
    const products = await Product.find({ name: req.body.name }).exec();
    if (products.length > 0) {
      const categories = await Category.find({}).exec();
      res.render("productForm", {
        title: "Create Product",
        categories,
        product,
        errors: [{ msg: "Product name already exists" }],
      });
      return;
    }

    // save product to db and redirect to its page
    await product.save();
    res.redirect(product.url);
  }),
];

//
// UPDATE PRODUCTS
//

// GET update product form
exports.updateProductGet = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const [product, categories] = await Promise.all([
    mongoose.Types.ObjectId.isValid(productId)
      ? await Product.findById(productId).populate("category").exec()
      : null,
    mongoose.Types.ObjectId.isValid(productId)
      ? await Category.find().exec()
      : null,
  ]);

  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  // mark the product's category as selected in the category list
  for (const category of categories) {
    if (product.category._id.toString() === category._id.toString()) {
      category.selected = true;
      break;
    }
  }

  res.render("productForm", {
    title: "Update Product",
    categories,
    product: product,
    errors: [],
  });
});

// POST update product in db
exports.updateProductPost = [
  upload.single("image"),

  body("name", "Name must be at least 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must be at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("price", "Price must be a number").trim().isNumeric().escape(),
  body("quantity", "Quantity must be a number").trim().isNumeric().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // update product image if a new file is uploaded
    const originalProduct = await Product.findById(req.params.id).exec();
    const image = req.file
      ? `/images/${req.file.filename}`
      : originalProduct.image;

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      image: image,
      _id: req.params.id,
    });

    // errors exist: rerender form with error messages & sanitized values
    if (!errors.isEmpty()) {
      // mark the product's category as selected in the category list
      const categories = await Category.find().exec();
      for (const category of categories) {
        if (product.category?.toString() === category._id.toString()) {
          category.selected = true;
          break;
        }
      }

      res.render("productForm", {
        title: "Create Product",
        categories,
        product,
        errors: errors.array(),
      });
      return;
    }

    // if product with same name already exists, redirect user back to form w/ error
    const products = await Product.find({
      name: req.body.name,
      _id: { $ne: req.params.id },
    }).exec();

    if (products.length > 0) {
      // mark the product's category as selected in the category list
      const categories = await Category.find().exec();
      for (const category of categories) {
        if (product.category.toString() === category._id.toString()) {
          category.selected = true;
          break;
        }
      }

      res.render("productForm", {
        title: "Create Product",
        categories,
        product,
        errors: [{ msg: "Product name already exists" }],
      });
      return;
    }

    // no errors
    // delete old image if a new one was uploaded
    if (req.file && originalProduct.image) {
      fs.unlink(
        path.join(__dirname, `../public/${originalProduct.image}`),
        err => {
          if (err) console.log({ err });
        },
      );
    }

    // update product in db & redirect to product page
    await Product.findByIdAndUpdate(req.params.id, product, {}).exec();
    res.redirect(product.url);
  }),
];

//
// DELETE PRODUCTS
//

// GET delete product form
exports.deleteProductGet = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = mongoose.Types.ObjectId.isValid(productId)
    ? await Product.findById(productId).exec()
    : null;

  // product not found: throw an error
  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("productDelete", { title: "Delete Product", product });
});

// POST delete product in db
exports.deleteProductPost = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = mongoose.Types.ObjectId.isValid(productId)
    ? await Product.findById(productId).exec()
    : null;

  // product not found: throw an error
  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  // delete image if it exists
  if (product.image) {
    fs.unlink(path.join(__dirname, `../public/${product.image}`), err => {
      if (err) console.log({ err });
    });
  }

  await Product.findByIdAndRemove(productId).exec();
  res.redirect("/inventory/all");
});

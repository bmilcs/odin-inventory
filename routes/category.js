const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

// GET category homepage
router.get("/", (req, res) => {
  res.redirect("/all");
});

// GET all categories
router.get("/all", categoryController.all);

// GET & POST create category form
router
  .route("/create")
  .get(categoryController.createCategoryGet)
  .post(categoryController.createCategoryPost);

// GET & POST create category
router
  .route("/:id/update")
  .get(categoryController.updateCategoryGet)
  .post(categoryController.updateCategoryPost);

// GET & POST delete category
router
  .route("/:id/delete")
  .get(categoryController.deleteCategoryGet)
  .post(categoryController.deleteCategoryPost);

// GET category by id
router.get("/:id", categoryController.categoryById);

module.exports = router;

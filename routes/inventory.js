const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");

// GET inventory homepage
router.get("/", inventoryController.index);

// GET all products
router.get("/all", inventoryController.all);

// GET & POST create product
router
  .route("/create")
  .get(inventoryController.createProductGet)
  .post(inventoryController.createProductPost);

// GET & POST delete product
router
  .route("/:id/delete")
  .get(inventoryController.deleteProductGet)
  .post(inventoryController.deleteProductPost);

// GET & POST update product
router
  .route("/:id/update")
  .get(inventoryController.updateProductGet)
  .post(inventoryController.updateProductPost);

// GET product by id
router.get("/:id", inventoryController.productById);

module.exports = router;

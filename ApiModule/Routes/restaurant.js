const express = require("express");
const { Router } = express;
const router = Router();
const staffController = require("../Controllers/restaurantsStaff");

// Restaurant Staff Routes
router.post("/product", staffController.createNewProduct);
router.put("/product/:id", staffController.updateProduct);
router.delete("/product/:id", staffController.deleteProduct);
router.put("/campany/:id", staffController.updateRestaurant);
router.get("/ingredients", staffController.showAllIngredients);

module.exports = router;

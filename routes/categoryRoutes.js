const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/allCategories", categoryController.getAllCategories).post("/createCategory", categoryController.createCategory);

module.exports = router;
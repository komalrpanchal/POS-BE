const Category = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");

exports.getAllCategories = async (req, res, next) => {
    const category = await Category.find();
    res.status(200).json({
      status: "success",
      results: category.length,
      category
    });
  };

  exports.createCategory = factory.createOne(Category);
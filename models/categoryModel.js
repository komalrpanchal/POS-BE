const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  image: { type: String, default: "default.jpg" }
});

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String
    },
    categoryItems: [itemSchema]
  });
  
  const Category = mongoose.model("Category", categorySchema);
  
  module.exports = Category;
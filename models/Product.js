const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    rating: Number,
    image: String
});

module.exports = mongoose.model("Product", productSchema);

const Product = require("../models/Product");

const getProducts = async (req, res) => {
    let { search, category, minPrice, maxPrice, rating, page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (minPrice && maxPrice) query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };

    const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

    res.json(products);
};

module.exports = { getProducts };

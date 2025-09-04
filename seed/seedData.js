const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Product = require('../models/Product');

dotenv.config();
connectDB();

const products = [
  { name: 'Apple', category: 'Fruits', price: 120, stock: 100 },
  { name: 'Potato', category: 'Vegetables', price: 40, stock: 200 },
  { name: 'Tomato', category: 'Vegetables', price: 60, stock: 150 }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Data Imported!');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

importData();

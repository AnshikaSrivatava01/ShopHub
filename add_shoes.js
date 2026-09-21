const mongoose = require('mongoose');
require('dotenv').config({ path: '/Users/rashi/Documents/ShopHub/server/.env' });
const Product = require('/Users/rashi/Documents/ShopHub/server/models/Product.js');

async function addProduct() {
  try {
    await mongoose.connect('mongodb://localhost:27017/shophub');
    const newProduct = {
      name: 'Men\'s Classic Leather Formal Shoes',
      description: 'Handcrafted genuine leather Oxford shoes with cushioned insole, rubber outsole for grip, and classic lace-up design. Perfect for office and formal occasions.',
      category: 'Footwear',
      gender: 'Men',
      images: ['/images/mens_leather_shoes.png'],
      salePrice: 4999,
      rentPricePerDay: 300,
      rentPricePerWeek: 1400,
      rentPricePerMonth: 3500,
      stock: 18,
      isAvailableForRent: true,
      isAvailableForSale: true,
    };

    const ex = await Product.findOne({ name: newProduct.name });
    if (ex) {
      console.log('Product already exists, updating image...');
      await Product.updateOne({ name: newProduct.name }, { $set: { images: newProduct.images } });
    } else {
      await Product.create(newProduct);
      console.log('Restored product to DB.');
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}
addProduct();

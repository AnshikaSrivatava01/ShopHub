const mongoose = require('mongoose');

async function updateDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/shophub');
    console.log('Connected to shophub DB');
    
    // Find some products to make them rentals
    const Product = mongoose.model('Product', new mongoose.Schema({
        name: String, price: Number, type: String
    }, { strict: false }));
    
    const products = await Product.find({ type: 'buy', price: { $gt: 4000 } }).limit(8);

    console.log(`Found ${products.length} products to convert to rent.`);

    for (let p of products) {
        // rental price is around 10% of buy price, rounded to nearest 100
        p.price = Math.round((p.price * 0.1) / 100) * 100 || 500;
        p.type = 'rent';
        await p.save();
    }

    console.log('Successfully updated products to be rentals!');
    process.exit(0);
  } catch (error) {
    console.log('Error:', error);
    process.exit(1);
  }
}

updateDB();

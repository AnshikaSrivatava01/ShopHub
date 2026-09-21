require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');

const users = [
  { name: 'Admin User', email: 'admin@shophub.com', password: 'admin123', role: 'admin', phone: '9876543210' },
  { name: 'Rashi Kumari', email: 'rashi@example.com', password: 'user1234', role: 'user', phone: '9123456789' },
  { name: 'Priya Patel', email: 'priya@example.com', password: 'user1234', role: 'user', phone: '8765432100' },
];

const products = [
  {
    name: 'Leather Crossbody Sling Bag',
    description: 'Genuine leather crossbody bag with adjustable strap, multiple compartments, and secure zip closure. Compact yet spacious for everyday essentials.',
    category: 'Bags',
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'],
    salePrice: 2799,
    rentPricePerDay: 150,
    rentPricePerWeek: 700,
    rentPricePerMonth: 2000,
    stock: 25,
    isAvailableForRent: true,
    isAvailableForSale: true,
  },
  {
    name: 'Men\'s Classic Leather Formal Shoes',
    description: 'Handcrafted genuine leather Oxford shoes with cushioned insole, rubber outsole for grip, and classic lace-up design. Perfect for office and formal occasions.',
    category: 'Footwear',
    gender: 'Men',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    salePrice: 4999,
    rentPricePerDay: 300,
    rentPricePerWeek: 1400,
    rentPricePerMonth: 3500,
    stock: 18,
    isAvailableForRent: true,
    isAvailableForSale: true,
  },
  {
    name: 'Silk Stole & Scarf Collection',
    description: 'Handwoven pure silk stole with traditional block print design. Lightweight and versatile, perfect as a fashion accessory or gift.',
    category: 'Accessories',
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'],
    salePrice: 1999,
    rentPricePerDay: 120,
    rentPricePerWeek: 600,
    rentPricePerMonth: 1500,
    stock: 35,
    isAvailableForRent: true,
    isAvailableForSale: true,
  },
  {
    name: 'Gold Plated Kundan Jewellery Set',
    description: 'Stunning gold-plated kundan necklace set with matching earrings and maang tikka. Hypoallergenic, perfect for bridal and festive wear.',
    category: 'Accessories',
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'],
    salePrice: 4999,
    rentPricePerDay: 350,
    rentPricePerWeek: 1500,
    rentPricePerMonth: 4000,
    stock: 10,
    isAvailableForRent: true,
    isAvailableForSale: true,
  },
  {
    name: 'Bridal Jewellery Set',
    description: 'Heavy, luxurious, traditional Indian bridal jewellery set including intricate necklace, jhumkas, and maang tikka adorned with stones.',
    category: 'Accessories',
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80'],
    salePrice: 12999,
    rentPricePerDay: 800,
    rentPricePerWeek: 3500,
    rentPricePerMonth: 10000,
    stock: 5,
    isAvailableForRent: true,
    isAvailableForSale: true,
  },
  {
    name: 'Premium Cotton Kurta Set',
    description: 'Handcrafted premium cotton kurta with palazzo pants. Elegant embroidery work, comfortable fit, perfect for festive occasions and daily wear.',
    category: 'Clothes',
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200'],
    salePrice: 2499,
    rentPricePerDay: 200,
    rentPricePerWeek: 800,
    rentPricePerMonth: 2000,
    stock: 30,
    isAvailableForRent: true,
    isAvailableForSale: true,
  },
  {
    name: 'Women\'s Embroidered Anarkali Suit',
    description: 'Gorgeous floor-length Anarkali suit with heavy threadwork embroidery. Includes dupatta with lace border. Available in multiple sizes.',
    category: 'Clothes',
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200'],
    salePrice: 5499,
    rentPricePerDay: 400,
    rentPricePerWeek: 1800,
    rentPricePerMonth: 4500,
    stock: 15,
    isAvailableForRent: true,
    isAvailableForSale: true,
  },
  {
    name: 'Women Gown',
    description: 'Gorgeous floor-length designer gown for women with heavy threadwork embroidery. Luxurious fabric, perfect for weddings, parties, and festive wear.',
    category: 'Clothes',
    gender: 'Women',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200'],
    salePrice: 6999,
    rentPricePerDay: 500,
    rentPricePerWeek: 2000,
    rentPricePerMonth: 5000,
    stock: 12,
    isAvailableForRent: true,
    isAvailableForSale: true,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});

    // Create users
    const createdUsers = await User.create(users);
    console.log(`✅ ${createdUsers.length} users seeded`);
    console.log(`   Admin: admin@shophub.com / admin123`);
    console.log(`   User:  rashi@example.com / user1234`);

    // Create products
    const createdProducts = await Product.create(products);
    console.log(`✅ ${createdProducts.length} products seeded`);

    // Add some sample reviews
    const sampleReviews = [
      { user: createdUsers[1]._id, product: createdProducts[0]._id, rating: 5, comment: 'Beautiful kurta set! The fabric quality is amazing and fits perfectly.' },
      { user: createdUsers[2]._id, product: createdProducts[0]._id, rating: 4, comment: 'Great quality cotton, very comfortable for summer wear.' },
      { user: createdUsers[1]._id, product: createdProducts[1]._id, rating: 5, comment: 'Stunning saree! The silk quality and zari work are absolutely gorgeous.' },
      { user: createdUsers[2]._id, product: createdProducts[4]._id, rating: 5, comment: 'Gorgeous kundan set. Received so many compliments at the wedding!' },
      { user: createdUsers[1]._id, product: createdProducts[8]._id, rating: 4, comment: 'Very comfortable formal shoes. Great leather quality and finish.' },
      { user: createdUsers[2]._id, product: createdProducts[10]._id, rating: 5, comment: 'Best running shoes! Super lightweight and the cushioning is amazing.' },
    ];
    await Review.create(sampleReviews);
    console.log(`✅ ${sampleReviews.length} reviews seeded`);

    // Update product ratings
    for (const product of createdProducts) {
      const reviews = await Review.find({ product: product._id });
      if (reviews.length > 0) {
        const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(product._id, {
          avgRating: Math.round(avg * 10) / 10,
          numReviews: reviews.length,
        });
      }
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();

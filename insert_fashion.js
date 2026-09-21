const products = [
  {
    name: 'Premium Cotton Kurta Set',
    description: 'Handcrafted premium cotton kurta with palazzo pants. Elegant embroidery work, comfortable fit, perfect for festive occasions and daily wear.',
    category: 'Clothes',
    gender: 'Women',
    images: ['/images/cotton_kurta_set.png'],
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
    images: ['/images/womens_gown.png'],
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
    images: ['/images/womens_gown.png'],
    salePrice: 6999,
    rentPricePerDay: 500,
    rentPricePerWeek: 2000,
    rentPricePerMonth: 5000,
    stock: 12,
    isAvailableForRent: true,
    isAvailableForSale: true,
  }
];

for (const p of products) {
  db.products.updateOne(
    { name: p.name },
    { $set: p },
    { upsert: true }
  );
}
print("Done upserting fashion items.");

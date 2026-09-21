const products = [
  {
    name: 'Silk Stole & Scarf Collection',
    description: 'Handwoven pure silk stole with traditional block print design. Lightweight and versatile, perfect as a fashion accessory or gift.',
    category: 'Accessories',
    gender: 'Women',
    images: ['/images/silk_stole_scarf.png'],
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
    images: ['/images/kundan_jewellery.png'],
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
    images: ['/images/bridal_jewellery.png'],
    salePrice: 12999,
    rentPricePerDay: 800,
    rentPricePerWeek: 3500,
    rentPricePerMonth: 10000,
    stock: 5,
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
print("Done upserting accessories.");

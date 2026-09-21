db.products.insertOne({
  name: "Men's Classic Leather Formal Shoes",
  description: "Handcrafted genuine leather Oxford shoes with cushioned insole, rubber outsole for grip, and classic lace-up design. Perfect for office and formal occasions.",
  category: "Footwear",
  gender: "Men",
  images: ["/images/mens_leather_shoes.png"],
  salePrice: 4999,
  rentPricePerDay: 300,
  rentPricePerWeek: 1400,
  rentPricePerMonth: 3500,
  stock: 18,
  isAvailableForRent: true,
  isAvailableForSale: true,
});
print("Done inserting.");

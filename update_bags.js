db.products.updateMany(
  { name: { $regex: /bag|backpack/i } },
  { $set: { category: "Bags" } }
);
print("Done updating bags.");

db.products.updateOne(
  { name: 'Women Gown' },
  { $set: { images: ['/images/womens_designer_gown.png'] } }
);
print("Done updating Women Gown image.");

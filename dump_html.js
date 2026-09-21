const fs = require('fs');

async function generateHtml() {
  const res = await fetch('http://localhost:5001/api/products');
  const data = await res.json();
  const products = data.products || data;
  let html = `<!DOCTYPE html><html><head><title>Products</title></head><body><h1>Products</h1>`;
  for (const p of products) {
    html += `
    <div style="border: 1px solid black; padding: 10px; margin: 10px;">
      <h2>Product ID: ${p._id}</h2>
      <h3>Product Name: ${p.name}</h3>
      <p>Category: ${p.category}</p>
      <img src="${p.images[0]}" style="max-height: 200px" />
    </div>`;
  }
  html += `</body></html>`;
  fs.writeFileSync('/Users/rashi/Documents/ShopHub/products_dump.html', html);
  console.log('Successfully wrote products_dump.html with ' + products.length + ' products');
}

generateHtml().catch(console.error);

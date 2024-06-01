const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('better-sqlite3');
const cors = require('cors');
const { type } = require('os');

const app = express();
app.use(cors());
const port = process.env.PORT || 3001; // Set port for server

// Configure body-parser middleware
app.use(bodyParser.json());

// Connect to the SQLite database (replace 'inventory.db' with your desired filename)
const db = new sqlite3('db/inventory.db');
// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    stock INTEGER,
    cost_price REAL,
    retail_price REAL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sales (
    sale_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    name TEXT,
    quantity INTEGER,
    cost_price REAL,
    retail_price REAL,
    gross_sale REAL,
    net_sale REAL,
    sales_date DATE
  )
`);

// Define functions for CRUD operations on the database (replace with your schema)
function createProduct(name, category, stock, costPrice, retailPrice) {
  try {
    db.prepare('INSERT INTO products (name, category, stock, cost_price, retail_price) VALUES (?, ?, ?, ?, ?)').run(name, category, stock, costPrice, retailPrice);
  } catch (err) {
    console.error(err);
  }
}

function getProducts() {
  return db.prepare('SELECT * FROM products').all();
}

function getProduct(productId) {
  return db.prepare('SELECT * FROM products WHERE product_id = ?').get(productId);
}

function updateProduct(productId, name, category, stock, costPrice, retailPrice) {
  try {
    db.prepare('UPDATE products SET name = ?, category = ?, stock = ?, cost_price = ?, retail_price = ? WHERE product_id = ?')
    .run(name, category, stock, costPrice, retailPrice, productId);
  } catch (err) {
    console.error(err);
  }
}

function deleteProduct(productId) {
  db.prepare('DELETE FROM products WHERE product_id = ?').run(productId);
}

function createSale(productId, name, quantity, costPrice, retailPrice, grossSale, netSale, salesDate) {
  try {
    db.prepare('INSERT INTO sales (product_id, name, quantity, cost_price, retail_price, gross_sale, net_sale, sales_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(productId, name, quantity, costPrice, retailPrice, grossSale, netSale, salesDate);
  } catch (err) {
    console.error(err);
  }
}

function getSales() {
  return db.prepare('SELECT * FROM sales').all();
}

function updateSale(saleId, productId, name, quantity, costPrice, retailPrice, grossSale, netSale, salesDate) {
  try {
    db.prepare('UPDATE sales SET product_id = ?, name = ?, quantity = ?, cost_price = ?, retail_price = ?, gross_sale = ?, net_sale = ?, sales_date = ? WHERE sale_id = ?')
    .run(productId, name, quantity, costPrice, retailPrice, grossSale, netSale, salesDate, saleId);
  } catch (err) {
    console.error(err);
  }
}

function deleteSale(saleId) {
  db.prepare('DELETE FROM sales WHERE sale_id = ?').run(saleId);
}

// Define API endpoints for CRUD operations (replace with your specific logic)
app.post('/products', (req, res) => {
  let { name, category, stock, costPrice, retailPrice } = req.body;
  stock = parseInt(stock);
  costPrice = parseFloat(costPrice);
  retailPrice = parseFloat(retailPrice);
  createProduct(name, category, stock, costPrice, retailPrice);
  res.json({ message: 'Product created successfully', type: 'success' });
});

app.get('/products', (req, res) => {
  const products = getProducts();
  res.json(products);
});

app.get('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const product = getProduct(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.put('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const { name, category, stock, costPrice, retailPrice } = req.body;
  updateProduct(productId, name, category, stock, costPrice, retailPrice);
  res.json({ message: 'Product updated successfully', type: 'success' });
});

app.post('/deleteProducts', (req, res) => {
  let productIdArray = req.body;
  productIdArray.forEach(productId => {
    deleteProduct(productId);
  });
  res.json({ message: 'Product deleted successfully', type: 'success' });
});

//routes for sales
app.post('/sales', (req, res) => {
  let { productId, name, quantity, costPrice, retailPrice, grossSale, netSale, salesDate } = req.body;
  quantity = parseInt(quantity);
  salesDate = new Date(salesDate);
  salesDate = salesDate.toISOString().slice(0, 19).replace('T', ' ');
  createSale(productId, name, quantity, costPrice, retailPrice, grossSale, netSale, salesDate);
  res.json({ message: 'Sale created successfully', type: 'success' });
});

app.get('/sales', (req, res) => {
  const sales = getSales();
  res.json(sales);
});

app.put('/sales/:saleId', (req, res) => {
  const saleId = req.params.saleId;
  let { productId, name, quantity, costPrice, retailPrice, grossSale, netSale, salesDate } = req.body;
  salesDate = new Date(salesDate);
  salesDate = salesDate.toISOString().slice(0, 19).replace('T', ' '); 
  updateSale(saleId, productId, name, quantity, costPrice, retailPrice, grossSale, netSale, salesDate);
  res.json({ message: 'Sale updated successfully', type: 'success' });
});

app.post('/deleteSales', (req, res) => {
  let saleIdArray = req.body;
  saleIdArray.forEach(saleId => {
    deleteSale(saleId);
  });
  res.json({ message: 'Sale deleted successfully', type: 'success' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
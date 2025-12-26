const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
// Serve dashboard files too
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

// Sample data (in a real app, this would come from a database)
let products = [
    { id: 1, name: "Classic Tee", price: 29.99, category: "Tops", description: "Comfortable cotton t-shirt", stock: 50 },
    { id: 2, name: "Premium Hoodie", price: 59.99, category: "Outerwear", description: "Warm and stylish hoodie", stock: 30 },
    { id: 3, name: "Designer Jeans", price: 79.99, category: "Bottoms", description: "Slim-fit designer jeans", stock: 25 },
    { id: 4, name: "Summer Dress", price: 49.99, category: "Dresses", description: "Lightweight summer dress", stock: 20 },
    { id: 5, name: "Sports Cap", price: 24.99, category: "Accessories", description: "Adjustable sports cap", stock: 40 },
    { id: 6, name: "Comfy Sweatpants", price: 39.99, category: "Bottoms", description: "Comfortable sweatpants", stock: 35 }
];

let orders = [];
let nextOrderId = 1;

// API Routes
// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Create order
app.post('/api/orders', (req, res) => {
    const { customer, items, total } = req.body;
    
    if (!customer || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order data' });
    }
    
    const order = {
        id: nextOrderId++,
        customer,
        items,
        total,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    orders.push(order);
    res.status(201).json({ message: 'Order created successfully', order });
});

// Get all orders (for dashboard)
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    const orderId = parseInt(req.params.id);
    
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    res.json({ message: 'Order updated successfully', order });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // In a real app, you would save this to a database or send an email
    console.log('Contact form submission:', { name, email, message });
    
    res.json({ message: 'Message received successfully' });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
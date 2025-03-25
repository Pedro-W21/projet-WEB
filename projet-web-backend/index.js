const express = require('express');
const mongoose = require('mongoose');
const InventoryItem = require('./models/InventoryItem');

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/inventoryDB?', {
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

// Middleware
app.use(express.json());

// Routes
app.get('/api/inventory', async (req, res) => {
    try {
        const items = await InventoryItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching inventory' });
    }
});

app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({ "msg": "This has CORS enabled 🎈" })
})

app.post('/api/inventory', async (req, res) => {
    try {
        // Delete existing items
        await InventoryItem.deleteMany();
        // Insert new items
        const items = await InventoryItem.insertMany(req.body);
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error saving inventory' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const express = require('express');
const mongoose = require('mongoose');
const InventoryItem = require('./models/InventoryItem');
const GroupData = require('./models/GroupData');
const recettes = require('./recettes.json');

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
app.post('/api/group_inventories', async (req, res) => {
    try {
        // Delete existing items
        
        console.log(req.body.group_id);
        const items = await InventoryItem.find({group_id:req.body.group_id});
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error saving inventory' });
    }
});

app.get('/api/inventory', async (req, res) => {
    try {
        const items = await InventoryItem.find({group_id:req.params.group_id});
        console.log(req.params);
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error fetching inventory' });
    }
});

app.get('/api/groups', async (req, res) => {
    try {
        const groups = await GroupData.find();
        res.json(groups);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error fetching inventory' });
    }
});

app.post('/api/groups', async (req, res) => {
    try {
        // Delete existing items
        
        await GroupData.deleteMany();
        // Insert new items
        const items = await GroupData.insertMany(req.body);
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error saving inventory' });
    }
});

app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({ "msg": "This has CORS enabled 🎈" })
});

app.post('/api/inventory', async (req, res) => {
    try {
        // Delete existing items
        
        await InventoryItem.deleteMany({group_id:req.body.group_id});
        // Insert new items
        const items = await InventoryItem.insertMany(req.body.items);
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error saving inventory' });
    }
});

app.get('/api/inventory/recipes/:group_id', async (req, res) => {
    try {
        const groupId = req.params.group_id;
        if (!groupId) {
            return res.status(400).json({ error: 'Group ID is required' });
        }

        const items = await InventoryItem.find({ group_id: groupId });

        if (!items.length) {
            return res.json({ message: "Aucun ingrédient disponible dans ce groupe." });
        }

        let recettesDisponibles = [];

        for (const recette in recettes) {
            const ingrédients = recettes[recette]["ingrédients"];
            const lien = recettes[recette]["lien"];

            // Check if all ingredients are available in inventory
            let recettePossible = ingrédients.every(ingr =>
                items.some(item => item.name.toLowerCase() === ingr.toLowerCase() && item.quantity > 0)
            );

            if (recettePossible) {
                // Find the earliest expiration date among the matched ingredients
                let matchedItems = ingrédients.map(ingr =>
                    items.find(item => item.name.toLowerCase() === ingr.toLowerCase())
                );

                let earliestDate = matchedItems
                    .filter(item => item.bestBy) // make sure bestBy is defined
                    .map(item => new Date(item.bestBy))
                    .sort((a, b) => a - b)[0] || new Date(8640000000000000); // fallback to far future if no dates

                recettesDisponibles.push({
                    nom: recette,
                    lienRecette: lien,
                    dateExpiration: earliestDate
                });
            }
        }

        // Sort recipes by their earliest ingredient expiration date
        recettesDisponibles.sort((a, b) => a.dateExpiration - b.dateExpiration);

        if (recettesDisponibles.length === 0) {
            return res.json({ message: "Aucune recette trouvée avec les ingrédients disponibles." });
        } else {
            return res.json({
                recettes: recettesDisponibles
            });
        }

    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des recettes.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

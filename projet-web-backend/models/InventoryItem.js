const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    bestBy: { type: Date },
    /*_id: {type : Schema.Types.ObjectId, index: {unique:true}}*/
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);

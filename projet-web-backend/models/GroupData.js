const mongoose = require('mongoose');

const groupIDSchema = new mongoose.Schema({
    group_id: { type: String, required: true },
    /*_id: {type : Schema.Types.ObjectId, index: {unique:true}}*/
});

module.exports = mongoose.model('GroupData', groupIDSchema);
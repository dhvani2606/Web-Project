const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = mongoose.Schema({
    user: Schema.ObjectId,
    product: Schema.ObjectId
});

module.exports = mongoose.model('Favorite', favoriteSchema);
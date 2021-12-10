const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    tags: {type: String, required: false},
    image: {type: String, required: false}
});

module.exports = mongoose.model('Product', productSchema);
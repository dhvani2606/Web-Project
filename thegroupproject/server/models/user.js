const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone_number: {type: String, required: true},
    age: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
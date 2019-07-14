const mongoose = require('mongoose');

var Employee = mongoose.model('Employee', {
    
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    // state: { type: String },
    address: { type: String }
});

module.exports = { Employee };
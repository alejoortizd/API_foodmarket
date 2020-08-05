const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum:['Carne', 'Lacteos', 'Enlatados', 'Bebidas', 'Vegetales', 'Snacks']
    },
    originpath: {
        type: String
    },
    cantidad: {
	type: Number,
	default: 1
    },
    user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;

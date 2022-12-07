const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductoSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    precioVenta: { type: Number, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
});

module.exports = mongoose.model('Producto', ProductoSchema);

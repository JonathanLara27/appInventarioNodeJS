const mongoose = require('mongoose');
const { Schema } = mongoose;

const KardexSchema = new Schema({
    fecha: { type: Date, required: true },
    operacion: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    precioTotal: { type: Number, required: true },
    producto: { type: String, required: true }
});

//funcion para calcular el precio total
KardexSchema.methods.calcularPrecioTotal = function () {
    return this.cantidad * this.precioUnitario;
}

module.exports = mongoose.model('Kardex', KardexSchema);
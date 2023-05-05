//  Importamos Mongoose
const mongoose = require("mongoose");

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Creamos esquema del coche
const brandSchema = new Schema(
  {
    name: { type: String, required: true },
    creationYear: { type: Number, required: false },
    country: { type: String, required: false },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un coche valide con el Schema para ver si es valido.
const Brand = mongoose.model("Brand", brandSchema);

//  Exportamos para poder usarlo fuera
module.exports = { Brand };

//  Importamos Mongoose
const mongoose = require("mongoose");

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Creamos esquema del coche
const carSchema = new Schema(
  {
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: false },
    model: { type: String, trim: true, required: true },
    plate: { type: String, trim: true, required: false },
    power: { type: Number, required: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Identificará el id como una referencia de la entidad User relacionando las dos colecciones de la BBDD.
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un coche valide con el Schema para ver si es valido.
const Car = mongoose.model("Car", carSchema);

//  Exportamos para poder usarlo fuera
module.exports = { Car };

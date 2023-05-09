//  Importamos Mongoose
const mongoose = require("mongoose");

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Creamos esquema del coche
const allowedCountries = ["SPAIN", "ITALY", "FRANCE", "GERMANY", "USA"];
const currentYear = new Date().getFullYear();

const brandSchema = new Schema(
  {
    name: { type: String, trim: true, minLength: [3, " Al menos tres letras para el nombre"], maxLength: [20, "Nombre demasiado largo, máximo de 20 caracteres"], required: true }, // tim: true es un metodo de los string que permite quitarle por delamte y por detras los espacios.
    creationYear: { type: Number, min: [1803, "La marca de coches más antigua es Renault en 1803"], max: [currentYear, `Ese año es superior al año en curso que es ${currentYear}`], required: false },
    country: { type: String, trim: true, minLength: 3, maxLength: 10, enum: allowedCountries, uppercase: true, required: false },
  },
  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un coche valide con el Schema para ver si es valido.
const Brand = mongoose.model("Brand", brandSchema);

//  Exportamos para poder usarlo fuera
module.exports = { Brand };

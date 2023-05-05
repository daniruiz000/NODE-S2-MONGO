//  Importamos Mongoose
const mongoose = require("mongoose");

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Creamos esquema del usuario
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: false },
    address: {
      type: {
        street: { type: String, required: true },
        number: { type: Number, required: true },
        city: { type: String, required: true },
      },
      required: false,
    },
  },

  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);

// Creamos un modelo para que siempre que creamos un usuario valide con el Schema para ver si es valido.
const User = mongoose.model("User", userSchema);

//  Exportamos para poder usarlo fuera
module.exports = { User };

//  Importamos Mongoose
const mongoose = require("mongoose");

const validator = require("validator");
const bcrypt = require("bcrypt");

// Declaramos nuestro esquema que nos permite declarar nuestros objetos y crearle restricciones.
const Schema = mongoose.Schema;

// Creamos esquema del usuario
const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email incorrecto",
      },
      required: true,
    },
    password: {
      type: String,
      trim: true,
      unique: true,
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
      required: true,
    },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    phone: { type: String, trim: true, required: false },
    address: {
      type: {
        street: { type: String, trim: true, required: true },
        number: { type: Number, required: true },
        city: { type: String, trim: true, required: true },
      },
      required: false,
    },
  },

  { timestamps: true } // Cada vez que se modifique un documento refleja la hora y fecha de modificación
);
// Cada vez que se guarde un usuario encriptamos la contraseña
userSchema.pre("save", async function (next) {
  try {
    // Si la password estaba encriptada, no la encriptaremos de nuevo.
    if (this.isModified("password")) {
      // Si el campo password se ha modificado
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds); // Encriptamos la contraseña
      this.password = passwordEncrypted; // guardamos la password en la entidad User
      next();
    }
  } catch (error) {
    next();
  }
});

// Creamos un modelo para que siempre que creamos un usuario valide con el Schema para ver si es valido.
const User = mongoose.model("User", userSchema);

//  Exportamos para poder usarlo fuera
module.exports = { User };

// Importamos el modelo
const { connect } = require("../db.js");
const { User } = require("../models/User.js");

// Creamos 50 users aleatoriamente y los vamos añadiendo al array de users:
const userList = [
  {
    firstName: "Noah",
    lastName: "Hoppe",
    phone: "+34 60 902 06 30",
    address: {
      street: "Buckinghamshire",
      number: 176,
      city: "Simi Valley",
    },
  },
  {
    firstName: "Harvey",
    lastName: "Hickle",
    phone: "+34 70 456 38 48",
    address: {
      street: "Bedfordshire",
      number: 76,
      city: "Leesburg",
    },
  },
  {
    firstName: "Todd",
    lastName: "Moore",
    phone: "+34 58 470 62 31",
    address: {
      street: "Cambridgeshire",
      number: 17,
      city: "London",
    },
  },
  {
    firstName: "Luis",
    lastName: "Christiansen",
    phone: "+34 53 637 72 37",
    address: {
      street: "Bedfordshire",
      number: 145,
      city: "Macon-Bibb County",
    },
  },
  {
    firstName: "Teri",
    lastName: "King",
    phone: "+34 53 702 53 19",
    address: {
      street: "Borders",
      number: 136,
      city: "Palm Desert",
    },
  },
];

//  Función de reseteo de documentos de la colección.
const resetUsers = async () => {
  try {
    await connect();
    await User.collection.drop(); //  Esperamos a que borre los documentos de la collección users de la BBDD.
    console.log("Borrados users");
    await User.insertMany(userList); //  Esperamos a que inserte los nuevos documentos creados en la colección user de la BBDD.
    console.log("Creados users correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetUsers }; // Exportamos la función para poder usarla.

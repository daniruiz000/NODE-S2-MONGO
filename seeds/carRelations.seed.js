//  Importamos Mongoose:
const mongoose = require("mongoose");

// Conexión a la base de datos:
const { connect } = require("../db");
// Importamos la función que nos sirve para resetear los car:
const { carRelations } = require("../utils/carRelations");

//  Función asíncrona para conectar con la BBDD y ejecutar la función de reseteo de datos.
const seedCarRelations = async () => {
  try {
    await connect(); //  Esperamos a que conecte con la BBDD.
    await carRelations(); //  Esperamos que ejecute la función de reseteo de cars.
    console.log("Datos relacionados");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console(error);
  } finally {
    //   Finalmente desconecta de la BBDD.
    await mongoose.disconnect();
  }
};

seedCarRelations(); //  Llamamos a la función.

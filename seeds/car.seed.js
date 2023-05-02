//  Importamos mongoose:
const mongoose = require("mongoose");
//  Nos conectamos a la BBDD:
const { connect } = require("../db.js");
// Importamos el modelo:
const { Car } = require("../models/Car.js");

// Importamos la librería faker:
const { faker } = require("@faker-js/faker");

//  Creamos nuestro array de cars:
const carList = [];

// Creamos 50 cars aleatoriamente usando la libreria faker:
for (let i = 0; i < 50; i++) {
  const brand = faker.vehicle.manufacturer();
  const model = faker.vehicle.model();
  const plate = `${faker.datatype.number({ min: 1000, max: 9999 })}${faker.random.alpha(3).toUpperCase()}`;
  const power = faker.datatype.number({ min: 80, max: 300 });

  // Añadimos cada car creado a nuestra array de usuarios:
  carList.push({
    brand,
    model,
    plate,
    power,
  });
}

//  Función asincrona para resetear los cars:
const carSeed = async () => {
  try {
    // Esperamos conectarnos a la BBDD...
    await connect();
    console.log("Tenemos conexión con la BBDD");

    // Esperamos eliminar los datos previos:
    await Car.collection.drop();
    console.log("Datos eliminados correctamente");

    // Esperamos añadir los cars de nuestro array de cars:
    const documents = carList.map((car) => new Car(car));
    await Car.insertMany(documents);
    console.log("Datos guardados correctamente");

    // Si hay algún error en las peticiones...
  } catch (error) {
    console.error(error);
    console.error("Error al conectar con la BBDD");

    // Y finalmente siempre pase lo que pase ejecutará el contenido de finally
    // tanto si se ejecuta correctamente o no nuestro código.
  } finally {
    mongoose.disconnect();
    console.log("Desconexión de la BBDDD");
  }
};

//  Llamamos a la función:
carSeed();

// Importamos el modelo
const { Car } = require("../models/Car.js");

// Importamos la librería faker:
const { faker } = require("@faker-js/faker");

// Creamos 50 Cars aleatoriamente y los vamos añadiendo al array de Cars:
const carList = [];

for (let i = 0; i < 50; i++) {
  const newCar = {
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    plate: `${faker.datatype.number({ min: 1000, max: 9999 })}${faker.random.alpha(3).toUpperCase()}`,
    power: faker.datatype.number({ min: 80, max: 300 }),
  };

  // Añadimos el Car a nuestra array de Cars:
  carList.push(newCar);
}

//  Función de reseteo de documentos de la colección.
const resetCars = async () => {
  try {
    await Car.collection.drop(); //  Esperamos a que borre los documentos de la collección Car de la BBDD.
    console.log("Borrados Cars");
    await Car.insertMany(carList); //  Esperamos a que inserte los nuevos documentos creados en la colección Car de la BBDD.
    console.log("Creados Cars correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { resetCars }; // Exportamos la función para poder usarla.

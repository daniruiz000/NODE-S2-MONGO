// Importamos los modelos:
const { Brand } = require("../models/Brand");
const { Car } = require("../models/Car");
const { User } = require("../models/User");

const { generateRandom } = require("../utils/generateRandom");

//  Función de reseteo de documentos de la colección.
const carRelations = async () => {
  try {
    //  Recuperamos users, cars y brands
    const cars = await Car.find();
    if (!cars.length) {
      console.error("No hay coches en la BBDD.");
      return;
    }
    const users = await User.find();
    if (!users.length) {
      console.error("No hay usuarios en la BBDD.");
      return;
    }
    const brands = await Brand.find();
    if (!brands.length) {
      console.error("No hay marcas en la BBDD.");
      return;
    }

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      const randomBrand = brands[generateRandom(0, brands.length)];
      const randomUser = users[generateRandom(0, users.length)];
      car.owner = randomUser;
      car.brand = randomBrand;
      await car.save();
    }
    console.log("Relaciones entre colecciones creadas correctamente");
  } catch (error) {
    //  Si hay error lanzamos el error por consola.
    console.error(error);
  }
};

module.exports = { carRelations }; // Exportamos la función para poder usarla.

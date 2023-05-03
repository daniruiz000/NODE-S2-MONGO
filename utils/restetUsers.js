// Importamos el modelo
const { User } = require("../models/User.js");

// Importamos la librería faker:
const { faker } = require("@faker-js/faker");

// Creamos 50 users aleatoriamente y los vamos añadiendo al array de users:
const userList = [];

for (let i = 0; i < 50; i++) {
  const sex = faker.name.sexType();
  const newUser = {
    sex,
    firstName: faker.name.firstName(sex),
    lastName: faker.name.lastName(),
    phone: faker.phone.number("+34 ## ### ## ##"),
    address: {
      street: faker.address.county(),
      number: faker.datatype.number({ min: 1, max: 300 }),
      city: faker.address.cityName(),
    },
  };

  // Añadimos el users a nuestra array de users:
  userList.push(newUser);
}

//  Función de reseteo de documentos de la colección.
const resetUsers = async () => {
  try {
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

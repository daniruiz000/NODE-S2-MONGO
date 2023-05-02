//  Importamos mongoose:
const mongoose = require("mongoose");
//  Nos conectamos a la BBDD:
const { connect } = require("../db.js");
// Importamos el modelo:
const { User } = require("../models/User.js");

// Importamos la librería faker:
const { faker } = require("@faker-js/faker");

//  Creamos nuestro array de usuarios:
const userList = [];

// Creamos 50 usuarios aleatoriamente usando la libreria faker:
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

  // Añadimos cada usuario creado a nuestra array de usuarios:
  userList.push(newUser);
}

//  Función asincrona para resetear los usuarios:
const userSeed = async () => {
  try {
    // Esperamos conectarnos a la BBDD...
    await connect();
    console.log("Tenemos conexión con la BBDD");

    // Esperamos eliminar los datos previos:
    await User.collection.drop();
    console.log("Datos eliminados correctamente");

    // Esperamos añadir los usuarios de nuestro array de cars:
    const documents = userList.map((user) => new User(user)); // Creamos un nuevo usuario con cada elemento de nuestro array de usuarios contrastandolo con nuestro model User para ver si es válido.
    await User.insertMany(documents); // Insertamos nuestros documentos (usuarios).
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
userSeed();

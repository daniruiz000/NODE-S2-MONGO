// Importamos la función que nos sirve para resetear los car:
const { mongoose } = require("mongoose");
const { connect } = require("../db");
const { User } = require("../models/User");

const normalizationUser = async () => {
  try {
    await connect();
    console.log("Conexión realizada correctamente");

    const users = await User.find().select("+password");
    console.log(`Hemos recuperado ${users.length} usuarios de la base de datos`);
    // Las modificaciones se realizan según las reglas de negocio, se pueden inclusoeliminar datos que no sean correctos

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      await user.save();
      console.log(`Modificada usuario ${user.firstName}`);
    }

    console.log("Modificadas todas las usuarios de nuestra BBDD");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};
normalizationUser();
module.exports = { normalizationUser };

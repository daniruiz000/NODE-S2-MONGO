// Importamos la función que nos sirve para resetear los car:
const { mongoose } = require("mongoose");
const { connect } = require("..//db");
const { Brand } = require("../models/Brand");

const normalizationBrand = async () => {
  try {
    await connect();
    console.log("Conexión realizada correctamente");

    const brands = await Brand.find();
    console.log(`Hemos recuperado ${brands.length} marcas de la base de datos`);
    // Las modificaciones se realizan según las reglas de negocio, se pueden inclusoeliminar datos que no sean correctos

    for (let i = 0; i < brands.length; i++) {
      const brand = brands[i];
      brand.country = brand.country.toUpperCase();
      await brand.save();
      console.log(`Modificada marca ${brand.name}`);
    }

    console.log("Modificadas todas las marcas de nuestra BBDD");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};
normalizationBrand();
module.exports = { normalizationBrand };

// Importamos express:
const express = require("express");

// Importamos el modelo que nos sirve tanto para importar datos como para leerlos:
const { Brand } = require("../models/Brand.js");

// Importamos la función que nos sirve para resetear los book:
const { resetBrands } = require("../utils/resetBrands.js");

// Router propio de brand:
const router = express.Router();

//  ------------------------------------------------------------------------------------------

/*  Ruta para recuperar todos los brands de manera paginada en función de un limite de elementos a mostrar
por página para no saturar al navegador (CRUD: READ):
*/

router.get("/", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*"); //  Controlamos que se pueda acceder a la API desde el dominio http://localhost:3000/
  // Si funciona la lectura...
  try {
    // Recogemos las query params de esta manera req.query.parametro.
    const page = req.query.page;
    const limit = parseInt(req.query.limit);

    const brands = await Brand.find() // Devolvemos los brands si funciona. Con modelo.find().
      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit); // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit. // Con populate le indicamos que si recoge un id en la propiedad señalada rellene con los campos de datos que contenga ese id
    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el brand:
    const totalElements = await Brand.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: brands,
    };
    // Enviamos la respuesta como un json.
    res.json(response);

    // Si falla la lectura...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

/* Ejemplo de REQ indicando que queremos la página 4 estableciendo un limite de 10 elementos
 por página (limit = 10 , pages = 4):
 http://localhost:3000/user?limit=10&page=4 */

//  ------------------------------------------------------------------------------------------

//  Ruta para recuperar un brand en concreto a través de su id ( modelo.findById()) (CRUD: READ):

router.get("/:id", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  // Si funciona la lectura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const brand = await Brand.findById(id); //  Buscamos un documentos con un id determinado dentro de nuestro modelo con modelo.findById(id a busbrand).
    if (brand) {
      res.json(brand); //  Si existe el brand lo mandamos como respuesta en modo json.
    } else {
      res.status(404).json({}); //    Si no existe el brand se manda un json vacio y un código 400.
    }

    // Si falla la lectura...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/user/id del brand a busbrand

//  ------------------------------------------------------------------------------------------

//  Ruta para busbrand un brand por el nombre ( modelo.findById({firstName: name})) (CRUD: Operación Custom. No es CRUD):

router.get("/name/:name", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  const brandName = req.params.name;
  // Si funciona la lectura...
  try {
    // const brand = await brand.find({ firstName: name }); //Si quisieramos realizar una busqueda exacta, tal y como está escrito.
    const brand = await Brand.find({ name: new RegExp("^" + brandName.toLowerCase(), "i") }); //  Esperamos a que realice una busqueda en la que coincida el texto pasado por query params para la propiedad determinada pasada dentro de un objeto, porqué tenemos que pasar un objeto, sin importar mayusc o minusc.
    if (brand?.length) {
      res.json(brand); //  Si existe el brand lo mandamos en la respuesta como un json.
    } else {
      res.status(404).json([]); //   Si no existe el brand se manda un json con un array vacio porque la respuesta en caso de haber tenido resultados hubiera sido un array y un mandamos un código 404.
    }

    // Si falla la lectura...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/user/name/nombre del brand a busbrand

//  ------------------------------------------------------------------------------------------

//  Ruta para añadir elementos (CRUD: CREATE):

router.post("/", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  // Si funciona la escritura...
  try {
    const brand = new Brand(req.body); //     Un nuevo brand es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdBrand = await brand.save(); // Esperamos a que guarde el nuevo brand creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdBrand); // Devolvemos un código 201 que significa que algo se ha creado y el brand creado en modo json.

    // Si falla la escritura...
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    }
    res.status(500).json(error); //  Devolvemos un código de error 500 si falla la escritura y el error.
  }
});

/* Petición tipo de POST para añadir un nuevo brand (añadimos al body el nuevo brand con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newUser = {firstName: "Prueba Nombre", lastName: "Prueba apellido", phone: "Prueba tlf"}
 fetch("http://localhost:3000/user/",{"body": JSON.stringify(newUser),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */
//  ------------------------------------------------------------------------------------------

//  Endpoint para resetear los datos ejecutando cryptos:

router.delete("/reset", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  // Si funciona el reseteo...
  try {
    await resetBrands();
    res.send("Datos Brand reseteados");

    // Si falla el reseteo...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el reseteo de datos y el error.
  }
});

//  ------------------------------------------------------------------------------------------

//  Endpoin para eliminar brand identificado por id (CRUD: DELETE):

router.delete("/:id", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  // Si funciona el borrado...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const brandDeleted = await Brand.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del brand eliminado que busca y elimina con el metodo findByIdAndDelete(id del brand a eliminar).
    if (brandDeleted) {
      res.json(brandDeleted); //  Devolvemos el brand eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla el borrado...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el delete y el error.
  }
});

/* Petición tipo DELETE para eliminar un brand (no añadimos body a la busqueda y recogemos el id de los parametros de la ruta) identificado por su id:

fetch("http://localhost:3000/brand/id del brand a borrar",{"method":"DELETE","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

//  Endpoin para actualizar un elemento identificado por id (CRUD: UPDATE):

router.put("/:id", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  // Si funciona la actualización...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const brandUpdated = await Brand.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); // Esperamos que devuelva la info del brand actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true, runValidators:true} Le dice que nos mande el brand actualizado no el antiguo y que tiene que pasar por el filtro del modelo. Lo busca y elimina con el metodo findByIdAndDelete(id del brand a eliminar).
    if (brandUpdated) {
      res.json(brandUpdated); //  Devolvemos el brand actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla la actualización...
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    }
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el update y el error.
  }
});

/* Petición tipo de PUT para actualizar datos concretos (en este caso el tlf) recogidos en el body,
de un brand en concreto (recogemos el id de los parametros de la ruta ):

fetch("http://localhost:3000/user/id del brand a actualizar",{"body": JSON.stringify({phone:5555}),"method":"PUT","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------
// Exportamos
module.exports = { brandRouter: router };

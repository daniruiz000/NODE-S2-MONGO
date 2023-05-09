// Importamos express:
const express = require("express");

// Importamos el modelo que nos sirve tanto para importar datos como para leerlos:
const { Car } = require("../models/Car.js");

// Importamos la función que nos sirve para resetear los book:
const { resetCars } = require("../utils/resetCars.js");

// Router propio de car:
const router = express.Router();

//  ------------------------------------------------------------------------------------------

/*  Ruta para recuperar todos los cars de manera paginada en función de un limite de elementos a mostrar
por página para no saturar al navegador (CRUD: READ):
*/

router.get("/", async (req, res) => {
  // Si funciona la lectura...
  try {
    // Recogemos las query params de esta manera req.query.parametro.
    const page = req.query.page;
    const limit = parseInt(req.query.limit);

    const cars = await Car.find() // Devolvemos los cars si funciona. Con modelo.find().
      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit) // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit.
      .populate(["owner", "brand"]); // Con populate le indicamos que si recoge un id en la propiedad señalada rellene con los campos de datos que contenga ese id
    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el car:
    const totalElements = await Car.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: cars,
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

//  Ruta para recuperar un car en concreto a través de su id ( modelo.findById()) (CRUD: READ):

router.get("/:id", async (req, res) => {
  // Si funciona la lectura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const car = await Car.findById(id).populate(["owner", "brand"]); //  Buscamos un documentos con un id determinado dentro de nuestro modelo con modelo.findById(id a buscar).
    if (car) {
      res.json(car); //  Si existe el car lo mandamos como respuesta en modo json.
    } else {
      res.status(404).json({}); //    Si no existe el car se manda un json vacio y un código 400.
    }

    // Si falla la lectura...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/user/id del car a buscar

//  ------------------------------------------------------------------------------------------

//  Ruta para buscar un car por el nombre ( modelo.findById({firstName: name})) (CRUD: Operación Custom. No es CRUD):

router.get("/brand/:brand", async (req, res) => {
  const brand = req.params.brand;
  console.log(brand);
  // Si funciona la lectura...
  try {
    // const car = await car.find({ firstName: name }); //Si quisieramos realizar una busqueda exacta, tal y como está escrito.
    const car = await Car.find({ brand: { $regex: brand, $options: "i" } }).populate(["owner", "brand"]);

    if (car?.length) {
      res.json(car); //  Si existe el car lo mandamos en la respuesta como un json.
    } else {
      res.status(404).json([]); //   Si no existe el car se manda un json con un array vacio porque la respuesta en caso de haber tenido resultados hubiera sido un array y un mandamos un código 404.
    }

    // Si falla la lectura...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/user/name/nombre del car a buscar

//  ------------------------------------------------------------------------------------------

//  Ruta para añadir elementos (CRUD: CREATE):

router.post("/", async (req, res) => {
  // Si funciona la escritura...
  try {
    const car = new Car(req.body); //     Un nuevo car es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdCar = await car.save(); // Esperamos a que guarde el nuevo car creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdCar); // Devolvemos un código 201 que significa que algo se ha creado y el car creado en modo json.

    // Si falla la escritura...
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    }
    res.status(500).json(error); //  Devolvemos un código de error 500 si falla la escritura y el error.
  }
});

/* Petición tipo de POST para añadir un nuevo car (añadimos al body el nuevo car con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newUser = {firstName: "Prueba Nombre", lastName: "Prueba apellido", phone: "Prueba tlf"}
 fetch("http://localhost:3000/user/",{"body": JSON.stringify(newUser),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */
//  ------------------------------------------------------------------------------------------

//  Endpoint para resetear los datos ejecutando cryptos:

router.delete("/reset", async (req, res) => {
  // Si funciona el reseteo...
  try {
    await resetCars();
    res.send("Datos Car reseteados");

    // Si falla el reseteo...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el reseteo de datos y el error.
  }
});

//  ------------------------------------------------------------------------------------------

//  Endpoin para eliminar car identificado por id (CRUD: DELETE):

router.delete("/:id", async (req, res) => {
  // Si funciona el borrado...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const carDeleted = await Car.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del car eliminado que busca y elimina con el metodo findByIdAndDelete(id del car a eliminar).
    if (carDeleted) {
      res.json(carDeleted); //  Devolvemos el car eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla el borrado...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el delete y el error.
  }
});

/* Petición tipo DELETE para eliminar un car (no añadimos body a la busqueda y recogemos el id de los parametros de la ruta) identificado por su id:

fetch("http://localhost:3000/car/id del car a borrar",{"method":"DELETE","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

//  Endpoin para actualizar un elemento identificado por id (CRUD: UPDATE):

router.put("/:id", async (req, res) => {
  // Si funciona la actualización...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const carUpdated = await Car.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); // Esperamos que devuelva la info del car actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true} Le dice que nos mande el car actualizado no el antiguo. Lo busca y elimina con el metodo findByIdAndDelete(id del car a eliminar).
    if (carUpdated) {
      res.json(carUpdated); //  Devolvemos el car actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla la actualización...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el update y el error.
  }
});

/* Petición tipo de PUT para actualizar datos concretos (en este caso el tlf) recogidos en el body,
de un car en concreto (recogemos el id de los parametros de la ruta ):

fetch("http://localhost:3000/user/id del car a actualizar",{"body": JSON.stringify({phone:5555}),"method":"PUT","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------
// Exportamos
module.exports = { carRouter: router };

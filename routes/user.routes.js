// Importamos express:
const express = require("express");

// Importamos el modelo que nos sirve tanto para importar datos como para leerlos:
const { User } = require("../models/User.js");
const { Car } = require("../models/Car.js");
// Importamos la función que nos sirve para resetear los book:
const { resetUsers } = require("../utils/resetUsers.js");

// Router propio de usuario:
const router = express.Router();

//  ------------------------------------------------------------------------------------------

/*  Ruta para recuperar todos los usuarios de manera paginada en función de un limite de elementos a mostrar
por página para no saturar al navegador (CRUD: READ):
*/

router.get("/", async (req, res) => {
  // Si funciona la lectura...
  try {
    // Recogemos las query params de esta manera req.query.parametro.
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const users = await User.find() // Devolvemos los usuarios si funciona. Con modelo.find().
      .limit(limit) // La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos, coge desde el inicio a no ser que le añadamos...
      .skip((page - 1) * limit); // La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y con este cálculo podemos paginar en función del limit.

    //  Creamos una respuesta más completa con info de la API y los datos solicitados por el usuario:
    const totalElements = await User.countDocuments(); //  Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments()
    const totalPagesByLimit = Math.ceil(totalElements / limit); // Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.

    // Respuesta Completa:
    const response = {
      totalItems: totalElements,
      totalPages: totalPagesByLimit,
      currentPage: page,
      data: users,
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

//  Ruta para recuperar un usuario en concreto a través de su id ( modelo.findById()) (CRUD: READ):

router.get("/:id", async (req, res) => {
  // Si funciona la lectura...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const user = await User.findById(id); //  Buscamos un documentos con un id determinado dentro de nuestro modelo con modelo.findById(id a buscar).

    if (user) {
      const temporalUser = user.toObject(); // Creamos un suario temporal que recibira sólo los datos que nos interesan del usuario que exista con ese id. Recibo sólo los datos que nos interesan con toObject().
      const includeCars = req.query.includeCars === "true";

      if (includeCars) {
        const cars = await Car.find({ owner: id }); // Busco en la entidad Car los coches que correspondena ese id de User.
        temporalUser.cars = cars; // Añadimos la propiedad cars al usuario temporal con los coches que hemos recogido de la entidad Car.
      }
      res.json(temporalUser); // Enviamos la resspuesta en formato json.
    } else {
      res.status(404).json({}); //    Si no existe el usuario se manda un json vacio y un código 400.
    }

    // Si falla la lectura...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/user/id del usuario a buscar

//  ------------------------------------------------------------------------------------------

//  Ruta para buscar un usuario por el nombre ( modelo.findById({firstName: name})) (CRUD: Operación Custom. No es CRUD):

router.get("/name/:name", async (req, res) => {
  const name = req.params.name;
  // Si funciona la lectura...
  try {
    // const user = await User.find({ firstName: name }); //Si quisieramos realizar una busqueda exacta, tal y como está escrito.
    const user = await User.find({ firstName: new RegExp("^" + name.toLowerCase(), "i") }); //  Esperamos a que realice una busqueda en la que coincida el texto pasado por query params para la propiedad determinada pasada dentro de un objeto, porqué tenemos que pasar un objeto, sin importar mayusc o minusc.
    if (user?.length) {
      res.json(user); //  Si existe el usuario lo mandamos en la respuesta como un json.
    } else {
      res.status(404).json([]); //   Si no existe el usuario se manda un json con un array vacio porque la respuesta en caso de haber tenido resultados hubiera sido un array y un mandamos un código 404.
    }

    // Si falla la lectura...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código de error 500 y el error.
  }
});

// Ejemplo de REQ:
// http://localhost:3000/user/name/nombre del usuario a buscar

//  ------------------------------------------------------------------------------------------

//  Ruta para añadir elementos (CRUD: CREATE):

router.post("/", async (req, res) => {
  // Si funciona la escritura...
  try {
    const user = new User(req.body); // Un nuevo usuario es un nuevo modelo de la BBDD que tiene un Scheme que valida la estructura de esos datos que recoge del body de la petición.
    const createdUser = await user.save(); // Esperamos a que guarde el nuevo usuario creado en caso de que vaya bien. Con el metodo .save().
    return res.status(201).json(createdUser); // Devolvemos un código 201 que significa que algo se ha creado y el usuario creado en modo json.

    // Si falla la escritura...
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

/* Petición tipo de POST para añadir un nuevo usuario (añadimos al body el nuevo usuario con sus propiedades que tiene que cumplir con el Scheme de nuestro modelo) identificado por su id:
 const newUser = {firstName: "Prueba Nombre", lastName: "Prueba apellido", phone: "Prueba tlf"}
 fetch("http://localhost:3000/user/",{"body": JSON.stringify(newUser),"method":"POST","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data)) */

//  ------------------------------------------------------------------------------------------

//  Endpoint para resetear los datos ejecutando cryptos:

router.delete("/reset", async (req, res) => {
  // Si funciona el reseteo...
  try {
    await resetUsers();
    res.send("Datos User reseteados");

    // Si falla el reseteo...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el reseteo de datos y el error.
  }
});

//  ------------------------------------------------------------------------------------------

//  Endpoin para eliminar usuario identificado por id (CRUD: DELETE):

router.delete("/:id", async (req, res) => {
  // Si funciona el borrado...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const userDeleted = await User.findByIdAndDelete(id); // Esperamos a que nos devuelve la info del usuario eliminado que busca y elimina con el metodo findByIdAndDelete(id del usuario a eliminar).
    if (userDeleted) {
      res.json(userDeleted); //  Devolvemos el usuario eliminado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla el borrado...
  } catch (error) {
    console.error(error);
    res.status(500).json(error); //  Devolvemos un código 500 de error si falla el delete y el error.
  }
});

/* Petición tipo DELETE para eliminar un usuario (no añadimos body a la busqueda y recogemos el id de los parametros de la ruta) identificado por su id:

fetch("http://localhost:3000/user/id del usuario a borrar",{"method":"DELETE","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------

//  Endpoin para actualizar un elemento identificado por id (CRUD: UPDATE):

router.put("/:id", async (req, res) => {
  // Si funciona la actualización...
  try {
    const id = req.params.id; //  Recogemos el id de los parametros de la ruta.
    const userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); // Esperamos que devuelva la info del usuario actualizado al que tambien hemos pasado un objeto con los campos q tiene que acualizar en la req del body de la petición. {new: true} Le dice que nos mande el usuario actualizado no el antiguo. Lo busca y elimina con el metodo findByIdAndDelete(id del usuario a eliminar).
    if (userUpdated) {
      res.json(userUpdated); //  Devolvemos el usuario actualizado en caso de que exista con ese id.
    } else {
      res.status(404).json({}); //  Devolvemos un código 404 y un objeto vacio en caso de que no exista con ese id.
    }

    // Si falla la actualización...
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

/* Petición tipo de PUT para actualizar datos concretos (en este caso el tlf) recogidos en el body,
de un usuario en concreto (recogemos el id de los parametros de la ruta ):

fetch("http://localhost:3000/user/id del usuario a actualizar",{"body": JSON.stringify({phone:5555}),"method":"PUT","headers":{"Accept":"application/json","Content-Type":"application/json"}}).then((data)=> console.log(data))
*/

//  ------------------------------------------------------------------------------------------
// Exportamos
module.exports = { userRouter: router };

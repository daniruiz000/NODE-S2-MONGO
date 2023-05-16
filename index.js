// Importamos express.
const express = require("express");
const cors = require("cors");

// Importamos las userRoutes:
const { userRouter } = require("./routes/user.routes"); //  LO IMPORTAMOS COMO UN OBJETO.
const { carRouter } = require("./routes/car.routes"); //  LO IMPORTAMOS COMO UN OBJETO.
const { brandRouter } = require("./routes/brand.routes"); //  LO IMPORTAMOS COMO UN OBJETO.
const { fileUploadRouter } = require("./routes/fileUpload.routes");

const main = async () => {
  // Conexión a la base de datos.
  const { connect } = require("./db.js"); // Importamos el archivo de conexión a la BBDD.
  const database = await connect(); //  Conectamos con la BBDD.

  //  Configuración del app:
  const PORT = 3000; //  Definimos el puerto.
  const app = express();
  app.use(express.json()); // Sepa interpretar los JSON.
  app.use(express.urlencoded({ extended: false })); //  Sepa interpretar bien los parametros de las rutas.
  app.use(cors({ origin: "http://localhost:3000" }));

  //  Rutas:
  const router = express.Router(); // Definimos el router que será el encargado de manejar las peticiones a nuestras rutas.

  router.get("/", (req, res) => {
    res.send(`Esta es la Home de nuestra API. Estamos usando la BBDD de ${database.connection.name}`);
  });

  // Para que todas las peticiones que no se correspondan con nuestras rutas den un codigo 404 y manden un mensaje de error.
  router.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página requerida.");
  });

  // Middlewares de aplicación(afecta a todas las rutas):
  // Ejemplo de Middleware de logs en consola.
  app.use((req, res, next) => {
    const date = new Date();
    console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date}`);
    next(); // Continua el código
  });

  // Acepta /car*
  app.use("/car", (req, res, next) => {
    console.log("Me han pedido coches.");
    next(); // Continua el código
  });

  //  Usamos las rutas (el orden es importante más restrictivos a menos):
  app.use("/file-upload", fileUploadRouter);
  app.use("/brand", brandRouter); //  Le decimos al app que utilice el brandRouter importado para gestionar las rutas que tengan "/brand".
  app.use("/car", carRouter); //  Le decimos al app que utilice el carRouter importado para gestionar las rutas que tengan "/car".
  app.use("/user", userRouter); //  Le decimos al app que utilice el userRouter importado para gestionar las rutas que tengan "/user".
  app.use("/public", express.static("public")); //  Utilice el middleware de ficheros estaticos y busque dentro de la carpeta public para solucionar las rutas solicitadas.
  app.use("/", router); //  Decimos al app que utilice el router en la raíz.

  // Ejemplo de Middleware de gestión de errores.
  app.use((err, req, res, next) => {
    console.log("*** INICIO DE ERROR ***");
    console.log(`Petición fallida de tipo ${req.method} a la url ${req.originalUrl}.`);
    console.log(err);
    console.log("*** FIN DE ERROR ***");

    if (err.name === "ValidationError") {
      res.status(400).json(err);
    } else {
      res.status(500).json(err);
    }
  });

  //  Levantamos el app en el puerto indicado:
  app.listen(PORT, () => {
    console.log(`Server levantado en puerto ${PORT}`);
  });
};

main(); //  Llamamos a la función.

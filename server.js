const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express"); //traemos clase wrapper
const { typeDefs, resolvers } = require("./controllers/SemestersController"); //añadimos semestres
const {
  SubjecttypeDefs,
  Subjectresolvers,
} = require("./controllers/SubjectsController"); //añadimos asignaturasnp
const { connectDb } = require("./config/database.js");

const app = express();

//apalac
const multer = require("multer");

//socket
const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer(app);
const io = socketIO(server);

// Configuración de Multer para almacenar archivos en un directorio específico
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directorio donde se almacenarán los archivos subidos
  },
  filename: function (req, file, cb) {
    // Se utiliza el nombre original del archivo, pero puedes personalizar esto según tus necesidades
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Ruta para manejar la subida de archivos
app.post("/subir-archivo", upload.single("fileInput"), (req, res) => {
  // Aquí puedes acceder a la información del archivo subido a través de req.file
  console.log(req.file);

  // Realiza cualquier lógica adicional necesaria
  // Después de que el archivo se haya subido exitosamente
  io.emit("archivoSubido", "Se ha subido un archivo al servidor");
  res.send("Archivo subido exitosamente (socket.io)");
});

// Configurar Socket.IO para manejar conexiones
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");
});


connectDb();

const publicDir = path.join(__dirname, "front", "html");

app.use(express.static(path.join(__dirname, "front")));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

async function start() {
  const apolloServer = new ApolloServer({
    typeDefs: [typeDefs, SubjecttypeDefs],
    resolvers: [resolvers, Subjectresolvers],
    context: ({ req }) => ({ io }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/api" });

  app.use((req, res, next) => {
    res.status(404).send("not found");
  });

  //Escucha en el puerto 3000node
  server.listen(process.env.PORT || 3000, () =>
    console.log("Server on port", process.env.PORT || 3000)
  );
}

start();

const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDefs, resolvers } = require("./controllers/SemestersController");
const { SubjecttypeDefs, Subjectresolvers } = require("./controllers/SubjectsController");
const { connectDb } = require("./config/database.js");
const pubsub = require('./pubsub');
const multer = require("multer");
const socketIO = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = socketIO(httpServer);

// Configuración de Multer para almacenar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Ruta para manejar la subida de archivos
app.post("/subir-archivo", upload.single("fileInput"), (req, res) => {
  console.log(req.file);
  io.emit("archivoSubido", "Se ha subido un archivo al servidor");
  res.send("Archivo subido exitosamente (socket.io)");
});

// Configurar Socket.IO para manejar conexiones
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");
  socket.on('subjectUpdated', (data) => {
    console.log('subjectUpdated event received:', data);
    io.emit('subjectUpdatedNotification', data);
  });
});

connectDb();

const publicDir = path.join(__dirname, "front", "html");
app.use(express.static(path.join(__dirname, "front")));
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

async function start() {
  
  const schema = makeExecutableSchema({ typeDefs: [typeDefs, SubjecttypeDefs], resolvers: [resolvers, Subjectresolvers] });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({ io, pubsub }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server: httpServer,
    path: apolloServer.graphqlPath,
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

start();

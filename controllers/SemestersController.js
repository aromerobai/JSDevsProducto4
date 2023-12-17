const { gql } = require("apollo-server-express");
const Semestre = require("../models/Semester");


const typeDefs = gql`
  type Semestre {
    id: ID
    nombre:String,
    descripcion:String,
    anno:  String,
    inicio: String,
    final: String,
    color:String,
  }

  input SemestreInput {
    nombre: String
    descripcion: String
    anno: String
    inicio: String
    final: String
    color: String
  }   

  type Query {
    hello: String
    getAllSemestre: [Semestre]
    getSemestre(id: ID): Semestre
  }

  type Mutation {
    createSemestre(SemestreInput: SemestreInput): Semestre
    deleteSemestre(id: ID): String
    deleteSemestreByIndex(index: Int): String
  }

`; 

const resolvers = {
    Query: {
      hello: () => "Hello world",
  
      getAllSemestre: async () => {
        const semestres = await Semestre.find();  
        return semestres; 
      },
  
      async getSemestre(_, { id }) {
        return await Semestre.findById(id);
      },
    },
    
    Mutation: {
      async createSemestre(parent, { SemestreInput }, { io }, context, info) {
        const { nombre, descripcion, anno, inicio, final, color } = SemestreInput; 
        const newSemestre = new Semestre({ nombre, descripcion, anno, inicio, final, color });
        await newSemestre.save();
        io.emit('semestreCreado', { status: "ok", message: "Se ha creado un Semestre" });
        return newSemestre;
      },
      async deleteSemestre(_, { id } , { io }) {
          await Semestre.findByIdAndDelete(id);
          io.emit('semestreEliminadoGeneral', { status: "ok", message: "Se ha eliminado un Semestre" });
          return "Task Deleted";
        },
      async deleteSemestreByIndex(_, { index }, { io }) {
          const semestreToDelete = await Semestre.findOne().skip(index).exec();
          if (!semestreToDelete) {
              throw new Error("Semestre not found");
          }
          await Semestre.deleteOne({ _id: semestreToDelete._id });
          io.emit('semestreEliminado', { status: "ok", message: "Se ha eliminado un Semestre" });
          return "Semestre Deleted";
      },
    },
  };

  module.exports = {
    typeDefs,
    resolvers,
  };
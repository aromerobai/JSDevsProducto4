const { gql } = require("apollo-server-express");
const Subject = require("../models/Subject");
const SUBJECT_UPDATED = 'SUBJECT_UPDATED';

const SubjecttypeDefs = gql`
  type Subject {
    id: ID
    nombre:String,
    descripcion:String,
    dificultad:  String,
    idSemestre: String,
    estado: String,
  }

  input SubjectInput {
    nombre:String,
    descripcion:String,
    dificultad:  String,
    idSemestre: String,
    estado: String,
  }   

  type Query {
    helloSubject: String,
    getAllSubjects: [Subject],
  }
  type Mutation {
    createSubject(SubjectInput: SubjectInput): Subject,
    deleteSubject(id: ID): String
    updateSubjectState(id: ID!, newState: String!): Subject
  }
  type Subscription {
    subjectUpdated: Subject
  }
`; 

const Subjectresolvers = {
    Query: {
        helloSubject: () => "Hello world",
        getAllSubjects: async () => {
            const subjects = await Subject.find();  
            return subjects; 
          },
    },
    Mutation: {
        async createSubject(parent, { SubjectInput }, { io }, context, info) {
          const { nombre, descripcion, dificultad, idSemestre, estado  } = SubjectInput; 
          const newSubject = new Subject({ nombre, descripcion, dificultad, idSemestre, estado });
          await newSubject.save();
          io.emit('subjectCreada', { status: "ok", message: "Se ha creado una Asignatura" });
          return newSubject;
        },
        async deleteSubject(_, { id }, { io }) {
            await Subject.findByIdAndDelete(id);
            io.emit('subjectEliminada', { status: "ok", message: "Se ha eliminado una Asignatura" });
            return "Task Deleted";
        },
        async updateSubjectState(_, { id, newState }, context) {
          try {
              const subject = await Subject.findById(id);
              if (!subject) {
                  throw new Error("La asignatura no fue encontrada.");
              }
              
              // Actualiza el estado de la asignatura con el nuevo estado proporcionado
              subject.estado = newState;
              await subject.save();

              // Subscripciones
              const { pubsub } = context;
              pubsub.publish(SUBJECT_UPDATED, { subjectUpdated: subject });
              
              return subject;
          } catch (error) {
              throw new Error(`Error al actualizar el estado de la asignatura: ${error}`);
          }
      },
    }, 
    Subscription: {
      subjectUpdated: {
        subscribe: () => pubsub.asyncIterator([SUBJECT_UPDATED])
      },
    },
  };

  module.exports = {
    SubjecttypeDefs,
    Subjectresolvers,
  };
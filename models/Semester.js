const { Schema, model } = require("mongoose");

const semestreSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  anno: {
    type: String,
  },
  inicio: {
    type: String,
  },
  final: {
    type: String,
  },
  color: {
    type: String,
  }
});

module.exports = model("Semestre", semestreSchema);
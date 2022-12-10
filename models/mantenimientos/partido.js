const { Schema, model } = require("mongoose");

const PartidoSchema = Schema(
  {
    categoria: {
      type: String,
      required: true,
    },
    modalidad: {
      type: String,
      required: true,
    },
    circuito: {
      type: String,
      required: true,
    },
    tipoPista: {
      type: String,
      required: true,
    },
    horaInicio: {
      type: String,
      required: true,
    },
    jugador1: {
      type: String,
      required: true,
    },
    jugador2: {
      type: String,
      required: true,
    },
    resultado: {
      type: String,
      required: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: false,
    },
    deporte: {
      type: Schema.Types.ObjectId,
      ref: "Deporte",
      required: false,
    }
  },{ timestamps: true }
);

PartidoSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Partido", PartidoSchema);

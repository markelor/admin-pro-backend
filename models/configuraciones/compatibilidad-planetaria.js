const { Schema, model, Number } = require("mongoose");

const CompatibilidadPlanetariaSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true
    },
    descripcion: {
      type: String,
      required: true,
    },
    configArmonias: [
      {
        cuerpoCeleste1: {
          type: String,
          required: true,
        },
        cuerpoCeleste2: {
          type: String,
          required: true,
        },
        armonia: {
          type: String,
          required: true,
        },
        puntos: {
          type: Number,
          required: true,
        },
      },
    ],
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { collection: "config-compatibilidades-planetarias", timestamps: true }
);

CompatibilidadPlanetariaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model(
  "CompatibilidadPlanetaria",
  CompatibilidadPlanetariaSchema
);

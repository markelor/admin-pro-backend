const { Schema, model } = require("mongoose");

const RelacionPlanetariaSchema = Schema(
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
    configAspectos: [
      {
        aspecto: {
          type: String,
          required: true,
        },
        grados: [
          {
            grado: {
              type: Number,
              required: true,
            },
          },
        ],
        orbe: {
          type: Number,
          required: true,
        },
        puntosPorGrado: {
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
  { collection: "relaciones-planetarias", timestamps: true }
);

RelacionPlanetariaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("RelacionPlanetaria", RelacionPlanetariaSchema);

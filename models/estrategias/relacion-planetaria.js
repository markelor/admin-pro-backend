const { Schema, model } = require("mongoose");

const EstrategiaSchema = Schema(
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
    relacionPlanetaria: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "RelacionPlanetaria",
    },
    compatibilidadPlanetaria: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "CompatibilidadPlanetaria",
    },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    }
  },
  {  timestamps: true }
);

EstrategiaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Estrategia", EstrategiaSchema);

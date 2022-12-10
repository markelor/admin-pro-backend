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
    cuerposFirmamentoNatal: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "CuerpoFirmamento",
    },
    cuerposFirmamentoTransitos: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "CuerpoFirmamento",
    },

    compatibilidadesPlanetarias: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "CompatibilidadPlanetaria",
    },
    relacionesPlanetarias: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "RelacionPlanetaria",
    },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
    aprendiendo: {
      required: true,
      type: Boolean,
      default:false
    }
  },
  { collection: "config-estrategias", timestamps: true }
);

EstrategiaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Estrategia", EstrategiaSchema);

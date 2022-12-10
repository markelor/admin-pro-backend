const { Schema, model } = require("mongoose");

const CuerpoFirmamentoSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    descripcion: {
      type: String,
      required: true,
      unique: true,
    },

    configCuerposCelestes: [
      {
        cuerpoCeleste: {
          required: true,
          type: Schema.Types.ObjectId,
          ref: "CuerpoCeleste",
        }
      }
    ],
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { collection: "config-cuerpos-firmamento", timestamps: true }
);

CuerpoFirmamentoSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("CuerpoFirmamento", CuerpoFirmamentoSchema);

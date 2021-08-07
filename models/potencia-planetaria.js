const { Schema, model } = require("mongoose");

const PotenciaSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true
    },
    configPotencias: [
      {
        potencia: {
          type: Number,
          required: true,
        },
        planeta1: {
          type: String,
          required: true,
        },
        planeta2: {
          type: String,
          required: true
        },
      },
    ],
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { timestamps: true }
);

PotenciaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Potencia", PotenciaSchema);

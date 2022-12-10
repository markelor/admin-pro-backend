const { Schema, model } = require("mongoose");

const CuerpoCelesteSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    abreviatura: {
      type: Number,
      required: true,
    },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { collection: "cuerpos-celestes", timestamps: true }
);

CuerpoCelesteSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("CuerpoCeleste", CuerpoCelesteSchema);

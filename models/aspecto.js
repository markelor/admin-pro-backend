const { Schema, model } = require("mongoose");

const AspectoSchema = Schema({
  aspectos: [
    {
      nombre: {
        type: String,
        required: true,
      },
      gradoAspecto: {
        type: Number,
        required: true,
      },
      orbe: {
        type: Number,
        required: true,
      },
      puntosPorGrado: {
        type: Number,
        required: true,
      }
    }
  ],
  usuario: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Usuario"
  }
},{ timestamps: true });

AspectoSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Aspecto", AspectoSchema);

const { Schema, model } = require("mongoose");

const JugadorSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true
    },
    nacion: { type: String },
    ciudad: { type: String, required: true },
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true },
    fechaNacimiento: { type: String, required: true },
    tiempo: { type: String },
    tiempoUniversal: { type: String },
    fiabilidad: { type: String, required: true },
    comprobado: { type: String, required: true },
    img: {
      type: String,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    deporte: {
      type: Schema.Types.ObjectId,
      ref: "Deporte",
      required: true
    },
  },
  { collection: "jugadores",timestamps: true }

);

JugadorSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Jugador", JugadorSchema);

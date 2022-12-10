const Jugador = require("../../models/mantenimientos/jugador");
const Partido = require("../../models/mantenimientos/partido");
const getJugadoresRegistradosQuery = async () => {
  return await Jugador.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");
};
const getJugadoresNoRegistradosQuery = async () => {
  return await Partido.aggregate([
    {
      $lookup: {
        from: "jugadores",
        localField: "jugador1",
        foreignField: "nombre",
        as: "jugador1_doc",
      },
    },
    { $match: { jugador1_doc: { $size: 0 } } },
    { $project: { jugador1_doc: 0 } },

    {
      $lookup: {
        from: "jugadores",
        localField: "jugador2",
        foreignField: "nombre",
        as: "jugador2_doc",
      },
    },

    { $match: { jugador2_doc: { $size: 0 } } },
    { $project: { jugador2_doc: 0 } },
    {
      $project: {
        jugador: {
          $concatArrays: [["$jugador1"], ["$jugador2"]],
        },
      },
    },
    { $unwind: "$jugador" },

    { $group: { _id: null, array: { $push: "$jugador" } } },
    { $sort: { array: 1 } },
    {
      $project: {
        array: true,
        _id: false,
        allValues: { $setUnion: ["$array"] },
      },
    },
    { $addFields: { jugadoresNoRegistrados: "$allValues" } },
    { $project: { jugadoresNoRegistrados: 1 } },
  ]);
};
const getJugadoresRegistradosHoyQuery = async (jugadores) => {
  return await Jugador.find({ nombre: { $in: jugadores }})
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");
};

const getJugadorPorIdQuery = async (id) => {
  return await Jugador.findById(id)
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");
};
const getJugadorPorNombreQuery = async (nombre) => {
  return await Jugador.findOne({
    nombre: nombre,
  });
};
const getJugadoresPorNombreQuery = async (nombre) => {
  return await Jugador.find({
    nombre: nombre,
  })
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");
};

const guardarJugadorQuery = async (jugador) => {
  return await jugador.save();
};
const actualizarJugadorPorIdQuery = async (id, cambiosJugador) => {
  return await Jugador.findByIdAndUpdate(id, cambiosJugador, { new: true });
};

const borrarJugadorPorIdQuery = async (id) => {
  return await Jugador.findByIdAndDelete(id);
};

module.exports = {
  getJugadoresRegistradosQuery,
  getJugadoresNoRegistradosQuery,
  getJugadoresRegistradosHoyQuery,
  getJugadorPorIdQuery,
  getJugadorPorNombreQuery,
  getJugadoresPorNombreQuery,
  guardarJugadorQuery,
  actualizarJugadorPorIdQuery,
  borrarJugadorPorIdQuery,
};

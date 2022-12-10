const Partido = require("../../models/mantenimientos/partido");

const getPartidosQuery = async () => {
  return await Partido.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");
};
const getHistoricoPartidosQuery = async () => {
  return await Partido.aggregate([
    /*{
      $match: {
         createdAt : {"$gt" : new Date(Date.now() - 90*24*60*60 * 1000) }
      }
    },*/
    {
      $lookup: {
        from: "jugadores",
        localField: "jugador1",
        foreignField: "nombre",
        as: "jugador1",
      },
    },
    {
      $match: {
        jugador1: { $ne: [] },
      },
    },
    {
      $lookup: {
        from: "jugadores",
        localField: "jugador2",
        foreignField: "nombre",
        as: "jugador2",
      },
    },
    {
      $match: {
        jugador2: { $ne: [] },
      },
    },
    {
      $project: {
        categoria: 1,
        circuito: 1,
        createdAt: 1,
        deporte: 1,
        horaInicio: 1,
        modalidad: 1,
        resultado: 1,
        jugador1: {
          $reduce: {
            input: "$jugador1",
            initialValue: {},
            in: { $mergeObjects: ["$$value", "$$this"] },
          },
        },
        jugador2: {
          $reduce: {
            input: "$jugador2",
            initialValue: {},
            in: { $mergeObjects: ["$$value", "$$this"] },
          },
        },
      },
    },
  ]);
};
const getHistoricoPartidosPorNombreQuery = async (jugadores) => {
  return await Partido.
    find({
      $or: [{ jugador1: { $in: jugadores } }, { jugador2: { $in: jugadores } }],
    }).populate("usuario", "nombre img")
    .populate("deporte", "nombre img");
};


module.exports = {
  getPartidosQuery,
  getHistoricoPartidosPorNombreQuery,
  getHistoricoPartidosQuery
};

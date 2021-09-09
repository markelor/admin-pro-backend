const Partido = require("../../models/mantenimientos/partido");

const getPartidosQuery = async () => {
  return await Partido.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");
};

module.exports = {
  getPartidosQuery
};

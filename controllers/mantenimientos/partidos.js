const { response } = require("express");
var request = require("request")

const partidosQuerys = require("../../querys/mantenimientos/partidos");

const getPartidos = async (req, res = response) => {
  try {
    const partidos=await partidosQuerys.getPartidosQuery();
    res.json({
      ok: true,
      partidos,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getPartidos
};

const { response } = require("express");

const Usuario = require("../models/usuario");
const Jugador = require("../models/jugador");
const Deporte = require("../models/deporte");

const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  const [usuarios, jugadores, deportes] = await Promise.all([
    Usuario.find({ nombre: regex }),
    Jugador.find({ nombre: regex }),
    Deporte.find({ nombre: regex }),
  ]);

  res.json({
    ok: true,
    usuarios,
    jugadores,
    deportes,
  });
};

const getDocumentosColeccion = async (req, res = response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  let data = [];

  switch (tabla) {
    case "jugadores":
      data = await Jugador.find({ nombre: regex })
        .populate("usuario", "nombre img")
        .populate("deporte", "nombre img");
      break;

    case "deportes":
      data = await Deporte.find({ nombre: regex }).populate(
        "usuario",
        "nombre img"
      );
      break;

    case "usuarios":
      data = await Usuario.find({ nombre: regex });

      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "La tabla tiene que ser usuarios/jugadores/deportes",
      });
  }

  res.json({
    ok: true,
    resultados: data,
  });
};

module.exports = {
  getTodo,
  getDocumentosColeccion,
};

const { response } = require("express");
const jugadoresQuerys = require("../querys/mantenimientos/jugadores");
const deportesQuerys = require("../querys/mantenimientos/deportes");
const usuariosQuerys = require("../querys/mantenimientos/usuarios");

const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  const [usuarios, jugadores, deportes] = await Promise.all([
    usuariosQuerys.getUsuariosPorNombreQuery(regex),
    jugadoresQuerys.getJugadoresPorNombreQuery(regex),
    deportesQuerys.getDeportesPorNombreQuery(regex),
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
      data = await jugadoresQuerys.getJugadoresPorNombreQuery(regex);
      break;

    case "deportes":
      data = await deportesQuerys.getDeportesPorNombreQuery(regex);
      break;

    case "usuarios":
      data = await usuariosQuerys.getUsuariosPorNombreQuery(regex);
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

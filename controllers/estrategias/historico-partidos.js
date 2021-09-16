const { response } = require("express");
var path = require("path");
const procesarCalculoCompatibilidades = require("child_process").fork(
  path.join(__dirname, "../../helpers/aprender-compatibilidades")
);
const compatibilidadesPlanetariasQuerys = require("../../querys/configuraciones/compatibilidades-planetarias");
const partidosQuerys = require("../../querys/mantenimientos/partidos");
const astrologia = require("../../core/astrologia/calculos-astrologicos");

const getHistoricoPartidosCarta = async (req, res = response) => {
  let resultadoHistoricoPartidos = await partidosQuerys.getHistoricoPartidosQuery();
  resultadoHistoricoPartidos = resultadoHistoricoPartidos.filter(
    (partido) => Number(partido.horaInicio.split(":")[0]) < 20
  );
  const estrategia = req.body;
  const signos = false;
  const casas = false;
  const aspectosCuadrante = req.body.aspectosCuadrante;
  const historicoPartidos = await astrologia.obtenerHistoricoPartidos(
    estrategia,
    resultadoHistoricoPartidos,
    signos,
    casas,
    aspectosCuadrante
  );

  res.json({
    ok: true,
    historicoPartidos,
  });
};
const getAprenderCompatibilidades = async (req, res = response) => {
  let resultadoHistoricoPartidos = await partidosQuerys.getHistoricoPartidosQuery();;
  resultadoHistoricoPartidos = resultadoHistoricoPartidos.filter(
    (partido) => Number(partido.horaInicio.split(":")[0]) < 20
  );
  let estrategia = req.body;
  const id = req.params.id;
  const uid = req.uid;
  //lanzar 100 veces
  for (let z = 0; z < 20; z++) {
    console.log("++++++++++++++++++++++++++++++++++++++++++++");
    console.log("veces", z);
    for (let y = 60; y >= 60; y = y - 5) {
      procesarCalculoCompatibilidades.send({
        estrategia,
        resultadoHistoricoPartidos,
        periodo: y,
      });
      estrategia = await new Promise((resolve) => {
        procesarCalculoCompatibilidades.on("message", (msg) => {
          resolve(msg.estrategiaGuardada);
        });
      });

      try {
        const compatibilidadPlanetaria =
          await compatibilidadesPlanetariasQuerys.getCompatibilidadPlanetariaPorIdQuery(
            id
          );

        if (!compatibilidadPlanetaria) {
          return res.status(404).json({
            ok: true,
            msg: "Compatibilidad planetaria no encontrada por id",
          });
        }

        const cambiosCompatibilidadPlanetaria = {
          ...estrategia.compatibilidadesPlanetarias,
          usuario: uid
        };

        const compatibilidadPlanetariaActualizado =
          await compatibilidadesPlanetariasQuerys.actualizarCompatibilidadPlanetariaPorIdQuery(
            id,
            cambiosCompatibilidadPlanetaria
          );
      } catch (error) {
        console.log(error);
        res.status(500).json({
          ok: false,
          msg: "Hable con el administrador",
        });
      }
    }
  }
  console.log("FIN");
  res.json({
    ok: true,
    estrategia: estrategia
  });
};

module.exports = {
  getHistoricoPartidosCarta,
  getAprenderCompatibilidades,
};

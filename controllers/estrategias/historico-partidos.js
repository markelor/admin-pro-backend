const { response } = require("express");
var path = require("path");
const procesarCalculoCompatibilidades = require("child_process").fork(
  path.join(__dirname, "../../helpers/aprender-compatibilidades")
);
const compatibilidadesPlanetariasQuerys = require("../../querys/configuraciones/compatibilidades-planetarias");
const partidosQuerys = require("../../querys/mantenimientos/partidos");
const estrategiasQuerys = require("../../querys/configuraciones/estrategias");
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
  let estrategia = req.body.estrategia;
  const id = req.params.id;
  const cicloDesde = req.body.cicloDesde;
  const cicloHasta = req.body.cicloHasta;
  const intervalo = req.body.intervalo;
  const repeticiones = req.body.repeticiones;
  const uid = req.uid;
  //Marcar aprendiendo estrategia
  try {
    estrategia.puntosNatal= req.body.puntosNatal;
    estrategia.aprendiendo = true;
    const cambiosEstrategia = {
      ...estrategia,
      usuario: uid,
    };
    const estrategiaActualizado = estrategiasQuerys.actualizarEstrategiaPorIdQuery(estrategia._id, cambiosEstrategia);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }

  let resultadoHistoricoPartidos = await partidosQuerys.getHistoricoPartidosQuery();
  resultadoHistoricoPartidos = resultadoHistoricoPartidos.filter(
    (partido) => Number(partido.horaInicio.split(":")[0]) < 20
  );

  //repeticiones
  for (let z = 0; z < repeticiones; z++) {
    console.log("++++++++++++++++++++++++++++++++++++++++++++");
    console.log("veces", z);
    for (let y = cicloDesde; y >= cicloHasta; y = y - intervalo) {
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
  //Quitar aprendiendo estrategia
  try {
    
    estrategia.aprendiendo = false;
    const cambiosEstrategia = {
      ...estrategia,
      usuario: uid,
    };
    const estrategiaActualizado = estrategiasQuerys.actualizarEstrategiaPorIdQuery(estrategia._id, cambiosEstrategia);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
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

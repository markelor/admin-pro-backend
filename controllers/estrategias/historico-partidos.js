const { response } = require("express");

const Partido = require("../../models/mantenimientos/partido");
const CompatibilidadPlanetaria = require("../../models/configuraciones/compatibilidad-planetaria");
const astrologia = require("../../core/astrologia/calculos-astrologicos");
const consultaHistoricoPartidos = () => {
  return Partido.aggregate([
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
  ]).exec();
};
const getHistoricoPartidos = async (req, res = response) => {
  let resultadoHistoricoPartidos = await consultaHistoricoPartidos();
  resultadoHistoricoPartidos=resultadoHistoricoPartidos.filter(
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
  let resultadoHistoricoPartidos = await consultaHistoricoPartidos();
  resultadoHistoricoPartidos=resultadoHistoricoPartidos.filter(
    (partido) => Number(partido.horaInicio.split(":")[0]) < 20
  );
  let estrategia = req.body;
  const signos = false;
  const casas = false;
  const aspectosCuadrante = req.body.aspectosCuadrante;
  let aciertoGuardado = 0;
  let falloGuardado = 0;
  let empateGuardado = 0;
  let arrayAciertoGuardado;
  let arrayFalloGuardado;
  let estrategiaGuardado = JSON.parse(JSON.stringify(estrategia));
  //lanzar 100 veces
  for (let z = 0; z < 20; z++) {
    console.log("++++++++++++++++++++++++++++++++++++++++++++");
    console.log("veces", z);
    for (let y = 85; y >= 55; y = y - 5) {
      aciertoGuardado = 0;
      falloGuardado = 0;
      arrayAciertoGuardado = [];
      arrayFalloGuardado = [];
      console.log("*****************************************");
      console.log("periodo", y);
      for (
        let i = 0;
        i < estrategia.compatibilidadesPlanetarias.configArmonias.length;
        i++
      ) {
        for (let j = -4; j < 5; j++) {
          let armoniaGuardado;
          if (j > 0) {
            armoniaGuardado = "Positivo";
          } else if (j < 0) {
            armoniaGuardado = "Negativo";
          } else {
            armoniaGuardado = "Neutro";
          }
          arrayAcierto = [];
          arrayFallo = [];
          let acierto = 0;
          let fallo = 0;
          let empate = 0;
          estrategia.compatibilidadesPlanetarias.configArmonias[i].armonia =
            armoniaGuardado;
          estrategia.compatibilidadesPlanetarias.configArmonias[i].puntos =
            Math.abs(j);

          const historicoPartidos = await astrologia.obtenerHistoricoPartidos(
            estrategia,
            resultadoHistoricoPartidos,
            signos,
            casas,
            aspectosCuadrante
          );

          for (const historicoPartido of historicoPartidos.historicoPartidos) {
            const jugador1Puntos =
              historicoPartido.jugador1Natal.relacionesPlanetarias
                .totalPuntosAspectos +
              historicoPartido.jugador1Natal.relacionesPlanetarias
                .totalPuntosCompatibilidad +
              historicoPartido.jugador1Transitos.relacionesPlanetarias
                .totalPuntosAspectos +
              historicoPartido.jugador1Transitos.relacionesPlanetarias
                .totalPuntosCompatibilidad;
            const jugador2Puntos =
              historicoPartido.jugador2Natal.relacionesPlanetarias
                .totalPuntosAspectos +
              historicoPartido.jugador2Natal.relacionesPlanetarias
                .totalPuntosCompatibilidad +
              historicoPartido.jugador2Transitos.relacionesPlanetarias
                .totalPuntosAspectos +
              historicoPartido.jugador2Transitos.relacionesPlanetarias
                .totalPuntosCompatibilidad;
            historicoPartido.partido.jugador1Puntos = jugador1Puntos;
            historicoPartido.partido.jugador2Puntos = jugador2Puntos;
            if (
              jugador1Puntos > jugador2Puntos &&
              historicoPartido.partido.ganador ===
                historicoPartido.partido.jugador1.nombre &&
              Math.abs(jugador1Puntos - jugador2Puntos) > y
            ) {
              arrayAcierto.push(historicoPartido);
              acierto++;
            } else if (
              jugador1Puntos < jugador2Puntos &&
              historicoPartido.partido.ganador ===
                historicoPartido.partido.jugador2.nombre &&
              Math.abs(jugador2Puntos - jugador1Puntos) > y
            ) {
              arrayAcierto.push(historicoPartido);
              acierto++;
            } else if (
              jugador1Puntos > jugador2Puntos &&
              historicoPartido.partido.ganador ===
                historicoPartido.partido.jugador2.nombre &&
              Math.abs(jugador1Puntos - jugador2Puntos) > y
            ) {
              arrayFallo.push(historicoPartido);
              fallo++;
            } else if (
              jugador1Puntos < jugador2Puntos &&
              historicoPartido.partido.ganador ===
                historicoPartido.partido.jugador1.nombre &&
              Math.abs(jugador2Puntos - jugador1Puntos) > y
            ) {
              arrayFallo.push(historicoPartido);
              fallo++;
            } else {
              empate++;
            }
          }
          if (
            (!aciertoGuardado && !falloGuardado) ||
            (acierto * 100) / (acierto + fallo) >
              (aciertoGuardado * 100) / (aciertoGuardado + falloGuardado)
          ) {
            aciertoGuardado = acierto;
            falloGuardado = fallo;
            arrayAciertoGuardado = arrayAcierto;
            arrayFalloGuardado = arrayFallo;
            empateGuardado = empate;
            estrategiaGuardado.compatibilidadesPlanetarias.configArmonias[
              i
            ].puntos = Math.abs(j);
            estrategiaGuardado.compatibilidadesPlanetarias.configArmonias[
              i
            ].armonia = armoniaGuardado;
            console.log("----------------------------------");
            console.log("acierto", aciertoGuardado),
              console.log("fallo", falloGuardado);
          }
        }
        estrategia = JSON.parse(JSON.stringify(estrategiaGuardado));
      }

      const id = req.params.id;
      const uid = req.uid;
      try {
        const compatibilidadPlanetaria =
          await CompatibilidadPlanetaria.findById(id);

        if (!compatibilidadPlanetaria) {
          return res.status(404).json({
            ok: true,
            msg: "Compatibilidad planetaria no encontrada por id",
          });
        }

        const cambiosCompatibilidadPlanetaria = {
          ...estrategiaGuardado.compatibilidadesPlanetarias,
          usuario: uid,
        };

        const compatibilidadPlanetariaActualizado =
          await CompatibilidadPlanetaria.findByIdAndUpdate(
            id,
            cambiosCompatibilidadPlanetaria,
            { new: true }
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
    estrategia: estrategia,
    fallos: arrayFalloGuardado,
  });
};

module.exports = {
  getHistoricoPartidos,
  getAprenderCompatibilidades,
};

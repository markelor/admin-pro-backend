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
  const resultadoHistoricoPartidos = await consultaHistoricoPartidos();
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
  const resultadoHistoricoPartidos = await consultaHistoricoPartidos();
  let estrategia = req.body;
  const signos = false;
  const casas = false;
  const aspectosCuadrante = req.body.aspectosCuadrante;
  let aciertoGuardado = 0;
  let falloGuardado = 0;
  let empateGuardado = 0;
  let estrategiaGuardado=JSON.parse(JSON.stringify(estrategia));
  for (let j= 0; j < estrategia.compatibilidadesPlanetarias
    .configArmonias.length; j++) {
  
    for (let index = -4; index < 5; index++) {
      let armoniaGuardado;

      /* console.log(historicoPartidos);
      console.log("ccccccccc");*/

      if (index > 0) {
        armoniaGuardado = "Positivo";
      } else if (index < 0) {
        armoniaGuardado = "Negativo";
      } else {
        armoniaGuardado = "Neutro";
      }
      const arrayAcierto = [];
      const arrayFallo = [];
      let acierto = 0;
      let fallo = 0;
      let empate = 0;
      estrategia.compatibilidadesPlanetarias
    .configArmonias[j].armonia = armoniaGuardado;
    estrategia.compatibilidadesPlanetarias
    .configArmonias[j].puntos = Math.abs(index);

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
          Math.abs(jugador1Puntos - jugador2Puntos) > 80
        ) {
          arrayAcierto.push(historicoPartido);
          acierto++;
        } else if (
          jugador1Puntos < jugador2Puntos &&
          historicoPartido.partido.ganador ===
            historicoPartido.partido.jugador2.nombre &&
          Math.abs(jugador2Puntos - jugador1Puntos) > 80
        ) {
          arrayAcierto.push(historicoPartido);
          acierto++;
        } else if (
          jugador1Puntos > jugador2Puntos &&
          historicoPartido.partido.ganador ===
            historicoPartido.partido.jugador2.nombre &&
          Math.abs(jugador1Puntos - jugador2Puntos) > 80
        ) {
          arrayFallo.push(historicoPartido);
          fallo++;
        } else if (
          jugador1Puntos < jugador2Puntos &&
          historicoPartido.partido.ganador ===
            historicoPartido.partido.jugador1.nombre &&
          Math.abs(jugador2Puntos - jugador1Puntos) > 80
        ) {
          arrayFallo.push(historicoPartido);
          fallo++;
        } else {
          empate++;
        }
        /* console.log('---------------------------------------');
            console.log(acierto);
            console.log('++++++++++++++++++++++++++++++++++++++++');*/
      }
      if (
        (!aciertoGuardado && !falloGuardado) ||
        (acierto * 100) / (acierto + fallo) >
          (aciertoGuardado * 100) / (aciertoGuardado + falloGuardado)
      ) {
        aciertoGuardado = acierto;
        falloGuardado = fallo;
        empateGuardado = empate;
        estrategiaGuardado.compatibilidadesPlanetarias.configArmonias[j].puntos = Math.abs(index);
        estrategiaGuardado.compatibilidadesPlanetarias.configArmonias[j].armonia = armoniaGuardado;
        console.log("----------------------------------");
        console.log("acierto", aciertoGuardado),
          console.log("fallo", falloGuardado);

        /*console.log("empate", empateGuardado);
        console.log(estrategia.compatibilidadesPlanetarias.configArmonias);*/
      }

      //console.log(estrategia.compatibilidadesPlanetarias.configArmonias);
    }
    estrategia =JSON.parse(JSON.stringify(estrategiaGuardado));
  }

  //arrayAcierto.forEach((element, index) => {*/
  /* console.log('*************************************ACIERTO*********************************')
    console.log('-------NATAL JUGADOR1------'+index);
    console.log(element.jugador1Natal.relacionesPlanetarias);
    console.log('-------TRANSITOS JUGADOR1------'+index);
    console.log(element.jugador1Transitos.relacionesPlanetarias);
    console.log('-------JUGADOR1 PUNTOS------'+index)
    console.log(element.partido.jugador1Puntos);
    console.log('-------NATAL JUGADOR2------'+index);
    console.log(element.jugador2Natal.relacionesPlanetarias);
    console.log('-------TRANSITOS JUGADOR2------'+index);
    console.log(element.jugador2Transitos.relacionesPlanetarias);
    console.log('-------JUGADOR2 PUNTOS------'+index)
    console.log(element.partido.jugador2Puntos);
    console.log('-------JUGADOR1------'+index)
    console.log(element.partido.jugador1.nombre);
    console.log('-------JUGADOR2------'+index)
    console.log(element.partido.jugador2.nombre);
    console.log('-------RESULTADO------'+index)
    console.log(element.partido.resultado);
    console.log('-------GANADOR------'+index)
    console.log(element.partido.ganador);*/
  /*  });
        arrayFallo.forEach((element, index) => {
          /* console.log('*************************************FALLO*********************************')
    console.log('-------NATAL JUGADOR1------'+index);
    console.log(element.jugador1Natal.relacionesPlanetarias);
    console.log('-------TRANSITOS JUGADOR1------'+index);
    console.log(element.jugador1Transitos.relacionesPlanetarias);
    console.log('-------JUGADOR1 PUNTOS------'+index)
    console.log(element.partido.jugador1Puntos);
    console.log('-------NATAL JUGADOR2------'+index);
    console.log(element.jugador2Natal.relacionesPlanetarias);
    console.log('-------TRANSITOS JUGADOR2------'+index);
    console.log(element.jugador2Transitos.relacionesPlanetarias);
    console.log('-------JUGADOR2 PUNTOS------'+index)
    console.log(element.partido.jugador2Puntos);
    console.log('-------JUGADOR1------'+index)
    console.log(element.partido.jugador1.nombre);
    console.log('-------JUGADOR2------'+index)
    console.log(element.partido.jugador2.nombre);
    console.log('-------RESULTADO------'+index)
    console.log(element.partido.resultado);
    console.log('-------GANADOR------'+index)
    console.log(element.partido.ganador);*/
  /*    });

        this.cargando = false;
        this.historicoPartidos = historicoPartidos;
      });
  }
}*/
 
  const id = req.params.id;
  const uid = req.uid;
  try {
    const compatibilidadPlanetaria = await CompatibilidadPlanetaria.findById(id);

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

    const compatibilidadPlanetariaActualizado = await CompatibilidadPlanetaria.findByIdAndUpdate(
      id,
      cambiosCompatibilidadPlanetaria,
      { new: true }
    );
    console.log('FIN');

    res.json({
      ok: true,
      compatibilidadesPlanetarias: compatibilidadPlanetariaActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getHistoricoPartidos,
  getAprenderCompatibilidades,
};

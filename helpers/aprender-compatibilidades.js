const astrologia = require("../core/astrologia/calculos-astrologicos");

const calcularCompatibilidades = async (
  estrategia,
  resultadoHistoricoPartidos,
  periodo
) => {
  const signos = false;
  const casas = false;
  let aciertoGuardado = 0;
  let falloGuardado = 0;
  let empateGuardado = 0;
  let arrayAciertoGuardado = [];
  let arrayFalloGuardado = [];
  let estrategiaGuardada = JSON.parse(JSON.stringify(estrategia));
  console.log("*****************************************");
  console.log("periodo", periodo);
  for (
    let i = 0;
    i < estrategia.compatibilidadesPlanetarias.configArmonias.length;
    i++
  ) {
    for (let j = -6; j < 7; j++) {
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
        undefined
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
          Math.abs(jugador1Puntos - jugador2Puntos) > periodo
        ) {
          arrayAcierto.push(historicoPartido);
          acierto++;
        } else if (
          jugador1Puntos < jugador2Puntos &&
          historicoPartido.partido.ganador ===
            historicoPartido.partido.jugador2.nombre &&
          Math.abs(jugador2Puntos - jugador1Puntos) > periodo
        ) {
          arrayAcierto.push(historicoPartido);
          acierto++;
        } else if (
          jugador1Puntos > jugador2Puntos &&
          historicoPartido.partido.ganador ===
            historicoPartido.partido.jugador2.nombre &&
          Math.abs(jugador1Puntos - jugador2Puntos) > periodo
        ) {
          arrayFallo.push(historicoPartido);
          fallo++;
        } else if (
          jugador1Puntos < jugador2Puntos &&
          historicoPartido.partido.ganador ===
            historicoPartido.partido.jugador1.nombre &&
          Math.abs(jugador2Puntos - jugador1Puntos) > periodo
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
        estrategiaGuardada.compatibilidadesPlanetarias.configArmonias[
          i
        ].puntos = Math.abs(j);
        estrategiaGuardada.compatibilidadesPlanetarias.configArmonias[
          i
        ].armonia = armoniaGuardado;
        console.log("----------------------------------");
        console.log("acierto", aciertoGuardado),
          console.log("fallo", falloGuardado);
      }
    }
    estrategia = JSON.parse(JSON.stringify(estrategiaGuardada));
  }
  return estrategia;
};

process.on("message", async (msg) => {
  const estrategiaGuardada = await calcularCompatibilidades(
    msg.estrategia,
    msg.resultadoHistoricoPartidos,
    msg.periodo
  );
  process.send({ estrategiaGuardada });
});

const ficheroPlanetas = require("./datos-json/planetas.json");
//const ficheroPartidas = require("./partidas/partidas");
const calculosAstrologicos = require("./calculos-core");
const EstadoPlanetas = require("./model/estado-planetas.model").EstadoPlanetas;
/**
 *Función que obtiene la información de cada planeta.Dignidades de signos y casas incluidas

 * @param latitud
 * @param longitud
 * @param fechaArrayCasa fecha natal para calcular casas
 * @param fechaArrayPlaneta fecha partido para calcular posiciones planetarias
 * @param calcularSignos calcular signos (solo para fechas exactas)
 * @param calcularCasas calcular casas (solo para fechas exactas)
 * @returns
 */
const obtenerInfoPlanetas = async (
  estrategia,
  latitud,
  longitud,
  calcularSignos,
  calcularCasas,
  fechaArrayCasa,
  fechaArrayPlaneta
) => {
  const fechaCasa = await calculosAstrologicos.calcularDiaJuliano(
    fechaArrayCasa
  );
  let fechaPlaneta;
  let configCuerposCelestes;

  if (fechaArrayPlaneta) {
    fechaPlaneta = await calculosAstrologicos.calcularDiaJuliano(
      fechaArrayPlaneta
    );
    configCuerposCelestes =
      estrategia.cuerposFirmamentoTransitos.configCuerposCelestes;
  } else {
    configCuerposCelestes =
      estrategia.cuerposFirmamentoNatal.configCuerposCelestes;
    fechaPlaneta = fechaCasa;
  }

  let totalPuntosSignos = 0;
  let totalPuntosCasas = 0;
  for (const configCuerpoCeleste of configCuerposCelestes) {
    const infoPlaneta = await calculosAstrologicos.obtenerInfoPlaneta(
      fechaPlaneta,
      configCuerpoCeleste.cuerpoCeleste
    );

    configCuerpoCeleste.cuerpoCeleste.grados = infoPlaneta.longitude;
    //Calcular casas (solo para cartas exactas con fechas definidas)
    if (calcularSignos) {
      calculosAstrologicos.calcularPlanetaEnSigno(
        configCuerpoCeleste.cuerpoCeleste,
        infoPlaneta
      );
      totalPuntosSignos =
        totalPuntosSignos + configCuerpoCeleste.cuerpoCeleste.signo.puntos;
    }
    //Calcular signos (solo para cartas exactas con fechas definidas)
    if (calcularCasas) {
      await calculosAstrologicos.calcularPlanetaEnCasa(
        fechaCasa,
        configCuerpoCeleste.cuerpoCeleste,
        latitud,
        longitud
      );
      totalPuntosCasas =
        totalPuntosCasas + configCuerpoCeleste.cuerpoCeleste.casa.puntos;
    }
    configCuerpoCeleste.cuerpoCeleste.retrogrado =
      infoPlaneta.longitudeSpeed < 0 ? true : false;
  }
  configCuerposCelestes.totalPuntosCasas =
    configCuerposCelestes.totalPuntosCasas + totalPuntosCasas;
  configCuerposCelestes.totalPuntosSignos =
    configCuerposCelestes.totalPuntosSignos + totalPuntosSignos;
  return configCuerposCelestes;
};

/**
 *Función que obtiene la carta natal del jugador
 * @param jugador
 */
const obtenerCartaNatal = async (
  estrategia,
  jugador,
  signos,
  casas,
  aspectosCuadrante
) => {
  const fechaNatalJugador = jugador.fechaNacimiento.split("-");
  const horaNatal = Number(jugador.tiempoUniversal.split(":")[0]);
  const minutoNatal = Number(jugador.tiempoUniversal.split(":")[1]);
  const fechaNatal = {
    ano: Number(fechaNatalJugador[0]),
    mes: Number(fechaNatalJugador[1]),
    dia: Number(fechaNatalJugador[2]),
    hora: horaNatal + minutoNatal / 60,
  };

  //obtener posiciones planetarias natal
  const posicionPlanetasNatal = await obtenerInfoPlanetas(
    estrategia,
    jugador.latitud,
    jugador.longitud,
    signos,
    casas,
    fechaNatal,
    undefined //fecha partida (transitos)
  );

  //obtener aspectos entre mapas planetarias natal
  const aspectosPlanetariosNatalVSaspectosPlanetariosNatal =
    calculosAstrologicos.calcularAspectosPlanetarios(
      estrategia,
      true, //natal
      posicionPlanetasNatal,
      posicionPlanetasNatal,
      aspectosCuadrante
    );
  return {
    planetasNatal: posicionPlanetasNatal,
    relacionesPlanetarias: aspectosPlanetariosNatalVSaspectosPlanetariosNatal,
  };
};
/**
 *Función que obtiene la carta transitos del jugador
 * @param jugador
 */
const obtenerCartaTransitos = async (
  estrategia,
  posicionPlanetasNatal,
  jugador,
  fechaInicioPartido,
  horaInicioPartido,
  signos,
  casas,
  aspectosCuadrante
) => {
  const horaPartido = Number(horaInicioPartido.split(":")[0]);
  const minutoPartido = Number(horaInicioPartido.split(":")[1]);

  const fechaPartido = {
    ano: fechaInicioPartido.getFullYear(),
    mes: fechaInicioPartido.getMonth() + 1,
    dia: fechaInicioPartido.getDate(),
    hora: horaPartido + minutoPartido / 60,
  };

  const fechaNatalJugador = jugador.fechaNacimiento.split("-");
  const horaNatal = Number(jugador.tiempoUniversal.split(":")[0]);
  const minutoNatal = Number(jugador.tiempoUniversal.split(":")[1]);
  const fechaNatal = {
    ano: Number(fechaNatalJugador[0]),
    mes: Number(fechaNatalJugador[1]),
    dia: Number(fechaNatalJugador[2]),
    hora: horaNatal + minutoNatal / 60,
  };

  const posicionPlanetasPartido = await obtenerInfoPlanetas(
    estrategia,
    jugador.latitud,
    jugador.longitud,
    signos,
    casas,
    fechaNatal,
    fechaPartido
  );

  //partida vs natal
  const aspectosPlanetariosNatalVSaspectosPlanetariosPartido =
    calculosAstrologicos.calcularAspectosPlanetarios(
      estrategia,
      false,
      posicionPlanetasPartido,
      posicionPlanetasNatal,
      aspectosCuadrante
    );
  return {
    planetasPartido: posicionPlanetasPartido,
    relacionesPlanetarias: aspectosPlanetariosNatalVSaspectosPlanetariosPartido,
  };
};
/**
 *
 * @param jugador
 */
const obtenerHistoricoPartidos = async (
  estrategia,
  partidos,
  signos,
  casas,
  aspectosCuadrante
) => {
  const historicoPartidos = [];

  //Obtener partidas del jugador

  for (const partido of partidos) {
    if (partido.jugador1.nombre && partido.jugador2.nombre) {
      if (
        Number(partido.resultado.split(":")[0]) >
        Number(partido.resultado.split(":")[1])
      ) {
        partido.ganador = partido.jugador1.nombre;
      } else if (
        Number(partido.resultado.split(":")[0]) <
        Number(partido.resultado.split(":")[1])
      ) {
        partido.ganador = partido.jugador2.nombre;
      }

      jugador1Natal = await obtenerCartaNatal(
        estrategia,
        partido.jugador1,
        signos,
        casas,
        aspectosCuadrante
      );
      //transito jugador 1
      jugador1Transitos = await obtenerCartaTransitos(
        estrategia,
        jugador1Natal.planetasNatal,
        partido.jugador1,
        partido.createdAt? new Date(partido.createdAt):new Date(),
        partido.horaInicio,
        signos,
        casas,
        aspectosCuadrante
      );
      //natal jugador2
      jugador2Natal = await obtenerCartaNatal(
        estrategia,
        partido.jugador2,
        signos,
        casas,
        aspectosCuadrante
      );
      //transito jugador 2
      jugador2Transitos = await obtenerCartaTransitos(
        estrategia,
        jugador2Natal.planetasNatal,
        partido.jugador2,
        partido.createdAt? new Date(partido.createdAt):new Date(),
        partido.horaInicio,
        signos,
        casas,
        aspectosCuadrante
      );
      historicoPartidos.push({
        partido,
        jugador1Natal,
        jugador1Transitos,
        jugador2Natal,
        jugador2Transitos,
      });
    }
  }

  return {
    historicoPartidos,
  };
};
module.exports = {
  obtenerCartaNatal,
  obtenerCartaTransitos,
  obtenerHistoricoPartidos,
  obtenerInfoPlanetas,
};


const ficheroPlanetas = require("./datos-json/planetas.json");
//const ficheroPartidas = require("./partidas/partidas");
const calculosAstrologicos = require("./calculos-core");
const EstadoPlanetas=require("./model/estado-planetas.model").EstadoPlanetas;
/**
 *Función que obtiene la información de cada planeta.Dignidades de signos y casas incluidas

 * @param latitud
 * @param longitud
 * @param fechaArrayCasa fecha natal para calcular casas
 * @param fechaArrayPlaneta fecha partida para calcular posiciones planetarias
 * @param calcularSignos calcular signos (solo para fechas exactas)
 * @param calcularCasas calcular casas (solo para fechas exactas)
 * @returns
 */
const obtenerInfoPlanetas = async (
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

  if (fechaArrayPlaneta) {
    fechaPlaneta = await calculosAstrologicos.calcularDiaJuliano(
      fechaArrayPlaneta
    );
  } else {
    fechaPlaneta = fechaCasa;
  }

  //Obtener planeta de json
  const estadoPlanetas = new EstadoPlanetas().deserializar(ficheroPlanetas);


  let totalPuntosSignos = 0;
  let totalPuntosCasas = 0;
  for (const planeta of estadoPlanetas.planetas) {

    const infoPlaneta = await calculosAstrologicos.obtenerInfoPlaneta(
      fechaPlaneta,
      planeta
    );
    planeta.grados = infoPlaneta.longitude;

    //Calcular casas (solo para cartas exactas con fechas definidas)
    if (calcularSignos) {
      calculosAstrologicos.calcularPlanetaEnSigno(planeta, infoPlaneta);
      totalPuntosSignos = totalPuntosSignos + planeta.signo.puntos;
    }
    //Calcular signos (solo para cartas exactas con fechas definidas)
    if (calcularCasas) {
      await calculosAstrologicos.calcularPlanetaEnCasa(
        fechaCasa,
        planeta,
        latitud,
        longitud
      );
      totalPuntosCasas = totalPuntosCasas + planeta.casa.puntos;
    }
    planeta.retrogrado = infoPlaneta.longitudeSpeed < 0 ? true : false;
  }
  estadoPlanetas.totalPuntosCasas =
    estadoPlanetas.totalPuntosCasas + totalPuntosCasas;
  estadoPlanetas.totalPuntosSignos =
    estadoPlanetas.totalPuntosSignos + totalPuntosSignos;
  return estadoPlanetas;
};

/**
 *Función que obtiene la carta natal del jugador
 * @param jugador
 */
const obtenerCartaNatal = async (jugador, signos, casas, aspectosCuadrante) => {

  const fechaNacimiento = jugador.fechaNacimiento.split("-");
  const hora=Number(jugador.tiempoUniversal.split(":")[0]);
  const minuto=Number(jugador.tiempoUniversal.split(":")[1]);
  const fechaNatal = {
    ano: Number(fechaNacimiento[0]),
    mes: Number(fechaNacimiento[1]),
    dia: Number(fechaNacimiento[2]),
    hora: hora+(minuto/60)
  };
  //obtener posiciones planetarias natal
  const posicionPlanetasNatal = await obtenerInfoPlanetas(
    jugador.latitud,
    jugador.longitud,
    signos,
    casas,
    fechaNatal
  );
  //obtener aspectos entre mapas planetarias natal
  const aspectosPlanetariosNatalVSaspectosPlanetariosNatal =
    calculosAstrologicos.calcularAspectosPlanetarios(
      true,
      posicionPlanetasNatal.planetas,
      posicionPlanetasNatal.planetas,
      aspectosCuadrante
    );
  return {
    planetasNatal: posicionPlanetasNatal.planetas,
    aspectos: aspectosPlanetariosNatalVSaspectosPlanetariosNatal,
  };
};
/**
 *
 * @param jugador
 */
/*const obtenerHistoricoJugador = async (
  jugador,
  signos,
  casas,
  aspectosCuadrante
) => {
  const transitos = [];

  //Obtener partidas del jugador
  const partidasJugador = ficheroPartidas.getHistoricoPartidasJugador(
    "src/ficheros/partidas/",
    jugador.nombre.toLowerCase()
  );
  const fechaNatalSplit = jugador.nacimiento.split("-");
  const fechaNatal = {
    ano: Number(fechaNatalSplit[0]),
    mes: Number(fechaNatalSplit[1]),
    dia: Number(fechaNatalSplit[2]),
    hora: jugador.tiempoUniversal,
  };
  //obtener posiciones planetarias natal
  const posicionPlanetasNatal = await obtenerInfoPlanetas(
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
      true, //natal
      posicionPlanetasNatal.planetas,
      posicionPlanetasNatal.planetas,
      aspectosCuadrante
    );
  let fechaPartidaSplit;
  let fechaPartida;
  for (const partida of partidasJugador) {
    fechaPartidaSplit = partida.fecha.split("-");
    fechaPartida = {
      ano: Number(fechaPartidaSplit[0]),
      mes: Number(fechaPartidaSplit[1]),
      dia: Number(fechaPartidaSplit[2]),
      hora: 15,
    };
    if (fechaPartida.ano && fechaPartida.mes && fechaPartida.dia) {
      //obtener posiciones planetarias natal
      const posicionPlanetasPartida = await obtenerInfoPlanetas(
        jugador.latitud,
        jugador.longitud,
        signos,
        casas,
        fechaNatal,
        fechaPartida
      );
      const aspectosPlanetariosNatalVSaspectosPlanetariosPartida =
        calculosAstrologicos.calcularAspectosPlanetarios(
          false,
          posicionPlanetasPartida.planetas,
          posicionPlanetasNatal.planetas,
          aspectosCuadrante
        );
      transitos.push({
        partida,
        planetasPartida: posicionPlanetasPartida,
        aspectosPartida: aspectosPlanetariosNatalVSaspectosPlanetariosPartida,
      });
    }
  }
  return {
    planetasNatal: posicionPlanetasNatal,
    aspectosNatal: aspectosPlanetariosNatalVSaspectosPlanetariosNatal,
    transitos: transitos,
  };
};*/
module.exports = {
  obtenerCartaNatal,
 // obtenerHistoricoJugador,
  obtenerInfoPlanetas,
};

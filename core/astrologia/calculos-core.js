const swisseph = require("swisseph");
const ficheroSignos = require("./datos-json/signos.json");
const ficheroAspectos = require("./datos-json/aspectos.json");
const ficheroDignidadesPlanetarias = require("./datos-json/dignidades.json");
const ficheroCompatibilidad = require("./datos-json/compatibilidad.json");
const Signos = require("./model/signos.model").Signos;
const DignidadesPlanetarias =
  require("./model/dignidades-planetarias.model").DignidadesPlanetarias;
const Aspectos = require("./model/aspectos.model").Aspectos;
const Compatibilidad = require("./model/compatibilidad.model").Compatibilidad;
var flag = swisseph.SEFLG_SPEED | swisseph.SEFLG_MOSEPH;

// path to ephemeris data
swisseph.swe_set_ephe_path(__dirname + "/../ephe");
/**
 * Función que calcula el día juliano de tipo number pasandole una fecha de tipo IFecha
 * @param fechaArray
 * @returns Promesa dia juliano
 */
const calcularDiaJuliano = (fechaArray) => {
  return new Promise((resolve) => {
    swisseph.swe_julday(
      fechaArray.ano,
      fechaArray.mes,
      fechaArray.dia,
      fechaArray.hora,
      swisseph.SE_GREG_CAL,
      (julday_ut) => {
        resolve(julday_ut);
      }
    );
  });
};
/**
 * Función que calcula la posición de cada planeta en un signo por tiempo
 * @param longitudSigno
 * @returns Tiempo
 */
const calcularTiempoSigno = (longitudSigno) => {
  var hour = Math.floor(longitudSigno);
  var minFrac = (longitudSigno - hour) * 60;
  var min = Math.floor(minFrac);
  var sec = Math.floor((minFrac - min) * 60);

  return {
    hora: hour,
    min: min,
    sec: sec,
  };
};

/**
 * Función que calcula las planetas en sigons con sus dignidades
 * @param planeta
 * @param infoPlaneta
 */
const calcularPlanetaEnSigno = (planeta, infoPlaneta) => {
  const claseSignos = new Signos().deserializar(ficheroSignos);
  planeta.signo.nombre =
    claseSignos.signos[Math.floor(infoPlaneta.longitude / 30)].nombre;
  //puntos por dignidades planetarias
  calcularPuntosDignidadesPlanetarias(planeta, "signo");
  planeta.signo.tiempo = calcularTiempoSigno(
    planeta.grados - Math.floor(infoPlaneta.longitude / 30) * 30
  );
};

/**
 * Funcion que obtiene puntos de dignidades planetarias signos y casas
 * @param planeta
 */
const calcularPuntosDignidadesPlanetarias = (planeta, opcion) => {
  const claseDignidadesPlanetarias = new DignidadesPlanetarias().deserializar(
    ficheroDignidadesPlanetarias
  );

  claseDignidadesPlanetarias.dignidades[
    planeta.nombre.charAt(0).toLowerCase() + planeta.nombre.substring(1)
  ].forEach((dignidadPlanetaria) => {
    //sumar puntos signo
    if (opcion === "signo") {
      if (dignidadPlanetaria.signo === planeta.signo.nombre) {
        //sumar puntos
        if (
          dignidadPlanetaria.estado === "Regente" ||
          dignidadPlanetaria.estado === "Exaltacion"
        ) {
          planeta.signo.puntos = dignidadPlanetaria.puntos;
        } else {
          //restar puntos
          planeta.signo.puntos = -Math.abs(dignidadPlanetaria.puntos);
        }
      }
    } else {
      //sumar puntos casa
      if (dignidadPlanetaria.casa === planeta.casa.numero) {
        //sumar puntos
        if (
          dignidadPlanetaria.estado === "Regente" ||
          dignidadPlanetaria.estado === "Exaltacion"
        ) {
          planeta.casa.puntos = dignidadPlanetaria.puntos;
        } else {
          //restar puntos
          planeta.casa.puntos = -Math.abs(dignidadPlanetaria.puntos);
        }
      }
    }
  });
};
/**
 * Función que calcula las dignidades de las casas pasandole el día juliano, latitud y la longitud
 * @param diaJuliano
 * @param latitud
 * @param latitud
 * @param longitud
 * @returns promesa
 */
const calcularPlanetaEnCasa = (diaJuliano, planeta, latitud, longitud) => {
  return new Promise((resolve) => {
    swisseph.swe_houses(
      diaJuliano,
      latitud,
      longitud,
      "P",
      (swissephInfoCasas) => {
        // Calcular AS,MC,DC,BC
        switch (planeta.nombre) {
          case "Ascendente":
            planeta.grados = swissephInfoCasas.house[0];
            break;
          case "MedioCielo":
            planeta.grados = swissephInfoCasas.house[9];
            break;
          case "Descendente":
            planeta.grados = swissephInfoCasas.house[6];
            break;
          case "BajoCielo":
            planeta.grados = swissephInfoCasas.house[3];
            break;
          default:
            break;
        }
        swissephInfoCasas.house.push(swissephInfoCasas.house[0]);
        for (
          let index = 0;
          index < swissephInfoCasas.house.length - 1;
          index++
        ) {
          if (
            (planeta.grados > swissephInfoCasas.house[index] &&
              planeta.grados < swissephInfoCasas.house[index + 1]) ||
            (Math.sign(
              swissephInfoCasas.house[index] -
                swissephInfoCasas.house[index + 1]
            ) > 0 &&
              planeta.grados > swissephInfoCasas.house[index] &&
              planeta.grados > swissephInfoCasas.house[index + 1])
          ) {
            planeta.casa.numero = index + 1;
          }
        }
        //obtener dignidades planetarias
        calcularPuntosDignidadesPlanetarias(planeta, "casa");
        resolve(planeta);
      }
    );
  });
};
/**
 * Funcion para obtener información sobre cada planeta
 * @param diaJuliano
 * @param planeta
 * @returns Promesa infoPlaneta
 */

const obtenerInfoPlaneta = (diaJuliano, planeta) => {
  return new Promise((resolve) => {
    swisseph.swe_calc_ut(diaJuliano, planeta.abreviatura, flag, (body) => {
      resolve(body);
    });
  });
};

/**
 * Función que calcula aspectos planetarios entre dos mapas cosmicas
 * @param posicionPlanetasPartida
 * @param posicionPlanetasNatal
 * @returns relaciones planetarias
 */
const calcularAspectosPlanetarios = (
  estrategia,
  natal,
  posicionPlanetasMapa1,
  posicionPlanetasMapa2,
  aspectosCuadrante
) => {
  let relacionesPlanetarias = {
    aspectos: [],
    totalPuntosAspectos: 0,
    totalPuntosCompatibilidad: 0,
  };

  let totalPuntosAspectos = 0;
  let totalPuntosCompatibilidad = 0;
  const configAspectos = estrategia.relacionesPlanetarias.configAspectos;
  posicionPlanetasMapa1.forEach((planetaMapa1) => {
    posicionPlanetasMapa2.forEach((planetaMapa2) => {
      const gradosAspecto = Math.round(
        Math.abs(
          planetaMapa1.cuerpoCeleste.grados - planetaMapa2.cuerpoCeleste.grados
        )
      );
      configAspectos.forEach((configAspecto) => {
        configAspecto.grados.forEach((grado) => {
          //orbe grados
          for (
            let index = grado.grado - configAspecto.orbe;
            index < grado.grado + configAspecto.orbe + 1;
            index++
          ) {
            if (gradosAspecto === ((index % 360) + 360) % 360) {
              let armonia;
              let puntosAspecto;
              const configArmonias =
                estrategia.compatibilidadesPlanetarias.configArmonias;
              configArmonias.forEach((configArmonia) => {
                if (
                  configArmonia.cuerpoCeleste1 ===
                    planetaMapa1.cuerpoCeleste.nombre &&
                  configArmonia.cuerpoCeleste2 ===
                    planetaMapa2.cuerpoCeleste.nombre
                ) {
                  armonia = configArmonia;
                  if (configArmonia.armonia === "Negativo") {
                    armonia.puntos = -Math.abs(configArmonia.puntos);
                  }
                }
              });

              //Calcular puntos por grado aspecto
              puntosAspecto = Math.abs(
                configAspecto.puntosPorGrado *
                  (configAspecto.orbe - Math.abs(grado.grado - gradosAspecto)) +
                  1
              );
              if (
                configAspecto.aspecto === "Cuadratura" ||
                configAspecto.aspecto === "Oposicion" ||
                configAspecto.aspecto === "Semicuadratura" ||
                configAspecto.aspecto === "Sesquicuadratura"
              ) {
                puntosAspecto = -Math.abs(
                  configAspecto.puntosPorGrado *
                    (configAspecto.orbe -
                      Math.abs(grado.grado - gradosAspecto)) +
                    1
                );
              } else if (configAspecto.aspecto === "Quincuncio") {
                if (armonia.puntos < 0) {
                  puntosAspecto = -Math.abs(
                    configAspecto.puntosPorGrado *
                      (configAspecto.orbe -
                        Math.abs(grado.grado - gradosAspecto)) +
                      1
                  );
                }
              } else if (configAspecto.aspecto === "Conjuncion") {
                if (armonia.puntos < 0) {
                  puntosAspecto = -Math.abs(
                    configAspecto.puntosPorGrado *
                      (configAspecto.orbe - Math.abs(index)) +
                      1
                  );
                } else if (armonia.puntos === 0) {
                  puntosAspecto = 0;
                } else {
                  puntosAspecto = Math.abs(
                    configAspecto.puntosPorGrado *
                      (configAspecto.orbe - Math.abs(index)) +
                      1
                  );
                }
              }
              const infoAspecto = {
                aspecto: configAspecto.aspecto,
                gradosAspecto: gradosAspecto,
                planetaMapa1: planetaMapa1.cuerpoCeleste.nombre,
                planetaMapa2: planetaMapa2.cuerpoCeleste.nombre,
                puntosAspecto: puntosAspecto,
                puntosCompatibilidad: armonia.puntos,
              };

              if (
                natal &&
                planetaMapa1.cuerpoCeleste.nombre ===
                  planetaMapa2.cuerpoCeleste.nombre
              ) {
                //No añadir planeta
              } else {
                //Quitar repetidas para natal
                const repeticion = relacionesPlanetarias.aspectos.find(
                  (relacionPlanetaria) =>
                    relacionPlanetaria.planetaMapa2 ===
                      planetaMapa1.cuerpoCeleste.nombre &&
                    relacionPlanetaria.planetaMapa1 ===
                      planetaMapa2.cuerpoCeleste.nombre
                );
                if (!repeticion) {
                  totalPuntosAspectos =
                    totalPuntosAspectos + infoAspecto.puntosAspecto;
                  totalPuntosCompatibilidad =
                    totalPuntosCompatibilidad +
                    infoAspecto.puntosCompatibilidad;
                  relacionesPlanetarias.aspectos.push(infoAspecto);
                }
              }
            }
          }
        });
      });
    });
  });
  if(natal){
    relacionesPlanetarias.totalPuntosAspectos = totalPuntosAspectos*estrategia.puntosNatal;
    relacionesPlanetarias.totalPuntosCompatibilidad = totalPuntosCompatibilidad*estrategia.puntosNatal;

  }else{
    relacionesPlanetarias.totalPuntosAspectos = totalPuntosAspectos;
    relacionesPlanetarias.totalPuntosCompatibilidad = totalPuntosCompatibilidad;
  }

  return relacionesPlanetarias;
};

module.exports = {
  calcularDiaJuliano,
  obtenerInfoPlaneta,
  calcularPlanetaEnCasa,
  calcularPlanetaEnSigno,
  calcularAspectosPlanetarios,
};

const { response } = require("express");
var request = require("request");
const astrologia = require("../../core/astrologia/calculos-astrologicos");
const partidosQuerys = require("../../querys/mantenimientos/partidos");
const jugadoresQuerys = require("../../querys/mantenimientos/jugadores");
const getPartidosGuardados = async (req, res = response) => {
  try {
    const partidos = await partidosQuerys.getPartidosQuery();
    res.json({
      ok: true,
      partidos,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const getPartidosHoy = async (req, res = response) => {
  const estrategia = req.body;
  const signos = false;
  const casas = false;
  const aspectosCuadrante = req.body.aspectosCuadrante;
  //var url = "http://localhost:5001";
  var url = "http://ec2-18-117-195-254.us-east-2.compute.amazonaws.com:5001";
  nombreJugadores = [];
  request(
    {
      url: url,
      json: true,
    },
    async function (error, resp, body) {
      if (!error && resp.statusCode === 200) {
        const partidosPorJugar = body[0].porJugar;
        partidosPorJugar.forEach((partido) => {
          nombreJugadores.push(partido.jugador1);
          nombreJugadores.push(partido.jugador2);
        });
        const jugadoresRegistrados =
          await jugadoresQuerys.getJugadoresRegistradosHoyQuery(
            nombreJugadores
          );
          const historicoPartidosPorNombre =
          await partidosQuerys.getHistoricoPartidosPorNombreQuery(
            nombreJugadores
          );
        partidosPorJugar.forEach((partido) => {
          
          jugadoresRegistrados.forEach((jugadorRegistrado) => {
            if (partido.jugador1 === jugadorRegistrado.nombre) {
              partido.jugador1 = jugadorRegistrado;
            } else if (partido.jugador2 === jugadorRegistrado.nombre) {
              partido.jugador2 = jugadorRegistrado;
            }
          });
          //Añadir historico partidos
          partido.jugador1HistoricoPartidos=[];
          partido.jugador2HistoricoPartidos=[];
          historicoPartidosPorNombre.forEach(historicoPartido => {
            if(partido.jugador1.nombre===historicoPartido.jugador1 || partido.jugador1.nombre===historicoPartido.jugador2){
              partido.jugador1HistoricoPartidos.push(historicoPartido);
            }else if(partido.jugador2.nombre===historicoPartido.jugador1 || partido.jugador2.nombre===historicoPartido.jugador2){
              partido.jugador2HistoricoPartidos.push(historicoPartido);
            }
          });
          
        });
        const partidosHoy = await astrologia.obtenerHistoricoPartidos(
          estrategia,
          partidosPorJugar,
          signos,
          casas,
          aspectosCuadrante
        );

        res.json({
          ok: true,
          partidosEnJuego: body[0].enDirecto,
          partidosPorJugar: partidosHoy,
        });
      } else {
        res.json({
          ok: false,
          msg: "Hable con el administrador",
        });
      }
    }
  );
};

module.exports = {
  getPartidosGuardados,
  getPartidosHoy,
};

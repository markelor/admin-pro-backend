
const astrologia = require("../core/astrologia/calculos-astrologicos");

// ==========================================
// Obtener historico de un jugador
// ==========================================

const getCartaNatal = async (req, res) => {
  const jugador = req.body.jugador;
  let signos = false;
  let casas = false;
  const estrategia=undefined;
  const aspectosCuadrante=undefined;

  /*if (jugador.fiabilidad === "Exacto") {
    signos = true;
    casas = true;
  }*/
  signos = true;
  casas = true;
  const cartaNatal = await astrologia.obtenerCartaNatal(
    estrategia,
    jugador,
    signos,
    casas,
    aspectosCuadrante
  );
  

  res.json({
    ok: true,
    sol:{
      signo:cartaNatal.planetasNatal[4].signo.nombre,
      tiempo:cartaNatal.planetasNatal[4].signo.tiempo
    
    },luna:{
      signo:cartaNatal.planetasNatal[5].signo.nombre,
      tiempo:cartaNatal.planetasNatal[5].signo.tiempo
    }
    //cartaNatal
  });
};
// ==========================================
// Obtener carta jugador
// ==========================================
const getHistoricoJugador = async (req, res) => {
  const jugador = req.body.jugador;
  const signos = req.body.signos;
  const casas = req.body.casas;
  const aspectosCuadrante = req.body.aspectosCuadrante;
  const historicoJugador = await astrologia.obtenerHistoricoJugador(
    jugador,
    true,
    true,
    true
  );
  res.json({
    ok: true,
    usuarios,
    total,
  });
};

module.exports = {
  getCartaNatal,
  getHistoricoJugador,
};

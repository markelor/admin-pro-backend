const { response } = require("express");

const Jugador = require("../../models/mantenimientos/jugador");
const jugadoresQuerys = require("../../querys/mantenimientos/jugadores");
const getJugadoresRegistrados = async (req, res = response) => {
  try {
    const jugadoresRegistrados =
      await jugadoresQuerys.getJugadoresRegistradosQuery();
    res.json({
      ok: true,
      jugadoresRegistrados,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const getJugadoresNoRegistrados = async (req, res = response) => {
  try {
    const jugadoresNoRegistrados =
      await jugadoresQuerys.getJugadoresNoRegistradosQuery();
    res.json({
      ok: true,
      jugadoresNoRegistrados: jugadoresNoRegistrados[0].jugadoresNoRegistrados,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getJugadorById = async (req, res = response) => {
  const id = req.params.id;
  try {
    const jugador = await jugadoresQuerys.getJugadorPorIdQuery(id);
    res.json({
      ok: true,
      jugador,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearJugador = async (req, res = response) => {
  const uid = req.uid;
  const jugador = new Jugador({
    usuario: uid,
    ...req.body,
  });
  try {
    const existeNombre = await jugadoresQuerys.getJugadorPorNombreQuery(
      jugador.nombre
    );
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "El jugador ya está registrado",
      });
    }
    const jugadorDB = await jugadoresQuerys.guardarJugadorQuery(jugador);

    res.json({
      ok: true,
      jugador: jugadorDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarJugador = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const jugador = await jugadoresQuerys.getJugadorPorIdQuery(id);

    if (!jugador) {
      return res.status(404).json({
        ok: true,
        msg: "Jugador no encontrado por id",
      });
    }

    const cambiosJugador = {
      ...req.body,
      usuario: uid,
    };
    const jugadorActualizado =
      await jugadoresQuerys.actualizarJugadorPorIdQuery(id, cambiosJugador);
    res.json({
      ok: true,
      jugador: jugadorActualizado
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarJugador = async (req, res = response) => {
  const id = req.params.id;

  try {
    const jugador = await jugadoresQuerys.getJugadorPorIdQuery(id);

    if (!jugador) {
      return res.status(404).json({
        ok: true,
        msg: "Jugador no encontrado por id",
      });
    }

    await jugadoresQuerys.borrarJugadorPorIdQuery(id);

    res.json({
      ok: true,
      msg: "Jugador borrado",
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
  getJugadoresRegistrados,
  getJugadoresNoRegistrados,
  crearJugador,
  actualizarJugador,
  borrarJugador,
  getJugadorById,
};

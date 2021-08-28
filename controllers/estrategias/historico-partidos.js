const { response } = require("express");

const Partido = require("../../models/mantenimientos/partido");
const astrologia = require("../../core/astrologia/calculos-astrologicos");
const getHistoricoPartidos = async (req, res = response) => {
  const consultaHistoricoPartidos = await Partido.aggregate([
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
  ]);
  const estrategia = req.body;
  const signos = false;
  const casas = false;
  const aspectosCuadrante = req.body.aspectosCuadrante;
  const historicoPartidos = await astrologia.obtenerHistoricoPartidos(
    estrategia,
    consultaHistoricoPartidos,
    signos,
    casas,
    aspectosCuadrante
  );

  res.json({
    ok: true,
    historicoPartidos,
  });
};

const getHistoricoPartidoById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const historicoPartido = await Partido.findById(id).populate(
      "usuario",
      "nombre img"
    );

    res.json({
      ok: true,
      historicoPartido,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearHistoricoPartido = async (req, res = response) => {
  const uid = req.uid;
  const historicoPartido = new HistoricoPartido({
    usuario: uid,
    ...req.body,
  });

  try {
    const existeNombre = await Partido.findOne({
      nombre: historicoPartido.nombre,
    });
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "La compatibilidad planetaria ya está registrada",
      });
    }
    const historicoPartidoDB = await historicoPartido.save();

    res.json({
      ok: true,
      historicoPartido: historicoPartidoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarHistoricoPartido = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const historicoPartido = await Partido.findById(id);

    if (!historicoPartido) {
      return res.status(404).json({
        ok: true,
        msg: "Compatibilidad planetaria no encontrada por id",
      });
    }

    const cambiosHistoricoPartido = {
      ...req.body,
      usuario: uid,
    };

    const historicoPartidoActualizado = await Partido.findByIdAndUpdate(
      id,
      cambiosHistoricoPartido,
      { new: true }
    );

    res.json({
      ok: true,
      historicoPartido: historicoPartidoActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarHistoricoPartido = async (req, res = response) => {
  const id = req.params.id;

  try {
    const historicoPartido = await Partido.findById(id);

    if (!historicoPartido) {
      return res.status(404).json({
        ok: true,
        msg: "Compatibilidad planetaria no encontrado por id",
      });
    }

    await Partido.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Compatibilidad planetaria borrada",
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
  crearHistoricoPartido,
  actualizarHistoricoPartido,
  borrarHistoricoPartido,
  getHistoricoPartidoById,
};

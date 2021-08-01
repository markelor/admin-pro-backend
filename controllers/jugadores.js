const { response } = require("express");

const Jugador = require("../models/jugador");
const partido = require("../models/partido");
const Partido = require("../models/partido");
const getJugadoresRegistrados = async (req, res = response) => {
  const jugadoresRegistrados = await Jugador.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");
  res.json({
    ok: true,
    jugadoresRegistrados,
  });
};
const getJugadoresNoRegistrados = async (req, res = response) => {
  const jugadoresNoRegistrados = await Partido.aggregate([
    {
      $lookup: {
        from: "jugadores",
        localField: "jugador1",
        foreignField: "nombre",
        as: "jugador1_doc",
      },
    },
    { $match: { jugador1_doc: { $size: 0 } } },
    { $project: { jugador1_doc: 0 } },

    {
      $lookup: {
        from: "jugadores",
        localField: "jugador2",
        foreignField: "nombre",
        as: "jugador2_doc",
      },
    },

    { $match: { jugador2_doc: { $size: 0 } } },
    { $project: { jugador2_doc: 0 } },
    {
      $project: {
        jugador: {
          $concatArrays: [["$jugador1"], ["$jugador2"]],
        },
      },
    },
    { $unwind: "$jugador" },

    { $group: { _id: null, array: { $push: "$jugador" } } },
    { $sort: { array: 1 } },
    {
      $project: {
        array: true,
        _id: false,
        allValues: { $setUnion: ["$array"] },
      },
    },
    { $addFields: { jugadoresNoRegistrados: "$allValues" } },
    { $project: { jugadoresNoRegistrados: 1 } }
  ]);

  res.json({
    ok: true,
    jugadoresNoRegistrados:jugadoresNoRegistrados[0].jugadoresNoRegistrados,
  });
};

const getJugadorById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const jugador = await Jugador.findById(id)
      .populate("usuario", "nombre img")
      .populate("deporte", "nombre img");

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
    const jugadorDB = await jugador.save();

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
    const jugador = await Jugador.findById(id);

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

    const jugadorActualizado = await Jugador.findByIdAndUpdate(
      id,
      cambiosJugador,
      { new: true }
    );

    res.json({
      ok: true,
      jugador: jugadorActualizado,
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
    const jugador = await Jugador.findById(id);

    if (!jugador) {
      return res.status(404).json({
        ok: true,
        msg: "Jugador no encontrado por id",
      });
    }

    await Jugador.findByIdAndDelete(id);

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

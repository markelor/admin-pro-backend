const { response } = require("express");

const HistoricoPartido = require("../../models/mantenimientos/partido");

const getHistoricoPartidos = async (req, res = response) => {
  const historicoPartidos = await HistoricoPartido.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");

  res.json({
    ok: true,
    historicoPartidos,
  });
};

const getHistoricoPartidoById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const historicoPartido = await HistoricoPartido.findById(id)
      .populate("usuario", "nombre img")
      /*.populate({
        path: "cuerposFirmamentoNatal",
        model: "CuerpoFirmamento",
        populate: {
          path: 'configCuerposCelestes.cuerpoCeleste',
          model: 'CuerpoCeleste'
        }
      })
      .populate({
        path: "cuerposFirmamentoTransitos",
        model: "CuerpoFirmamento",
        populate: {
          path: 'configCuerposCelestes.cuerpoCeleste',
          model: 'CuerpoCeleste'
        }
      })
      .populate("compatibilidadPlanetaria")
      .populate("relacionPlanetaria");*/

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
    const existeNombre = await HistoricoPartido.findOne({
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
    const historicoPartido = await HistoricoPartido.findById(id);

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

    const historicoPartidoActualizado = await HistoricoPartido.findByIdAndUpdate(
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
    const historicoPartido = await HistoricoPartido.findById(id);

    if (!historicoPartido) {
      return res.status(404).json({
        ok: true,
        msg: "Compatibilidad planetaria no encontrado por id",
      });
    }

    await HistoricoPartido.findByIdAndDelete(id);

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

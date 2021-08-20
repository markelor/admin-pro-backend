const { response } = require("express");

const Estrategia = require("../../models/configuraciones/estrategia");

const getEstrategias = async (req, res = response) => {
  const estrategias = await Estrategia.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");

  res.json({
    ok: true,
    estrategias,
  });
};

const getEstrategiaById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const estrategia = await Estrategia.findById(id)
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
      estrategia,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearEstrategia = async (req, res = response) => {
  const uid = req.uid;
  const estrategia = new Estrategia({
    usuario: uid,
    ...req.body,
  });

  try {
    const existeNombre = await Estrategia.findOne({
      nombre: estrategia.nombre,
    });
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "La compatibilidad planetaria ya está registrada",
      });
    }
    const estrategiaDB = await estrategia.save();

    res.json({
      ok: true,
      estrategia: estrategiaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEstrategia = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const estrategia = await Estrategia.findById(id);

    if (!estrategia) {
      return res.status(404).json({
        ok: true,
        msg: "Compatibilidad planetaria no encontrada por id",
      });
    }

    const cambiosEstrategia = {
      ...req.body,
      usuario: uid,
    };

    const estrategiaActualizado = await Estrategia.findByIdAndUpdate(
      id,
      cambiosEstrategia,
      { new: true }
    );

    res.json({
      ok: true,
      estrategia: estrategiaActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarEstrategia = async (req, res = response) => {
  const id = req.params.id;

  try {
    const estrategia = await Estrategia.findById(id);

    if (!estrategia) {
      return res.status(404).json({
        ok: true,
        msg: "Compatibilidad planetaria no encontrado por id",
      });
    }

    await Estrategia.findByIdAndDelete(id);

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
  getEstrategias,
  crearEstrategia,
  actualizarEstrategia,
  borrarEstrategia,
  getEstrategiaById,
};

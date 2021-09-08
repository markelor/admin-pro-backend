const { response } = require("express");

const Estrategia = require("../../models/configuraciones/estrategia");
const estrategiasQuerys = require("../../querys/configuraciones/estrategias");
const getEstrategias = async (req, res = response) => {
  try {
    const estrategias =
      await estrategiasQuerys.getEstrategiasQuery();
    res.json({
      ok: true,
      estrategias,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getEstrategiaById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const estrategia = await estrategiasQuerys.getEstrategiaPorIdQuery(id);
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
    const existeNombre = await estrategiasQuerys.getEstrategiaPorNombreQuery(estrategia.nombre)
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "La estrategia ya está registrada",
      });
    }
    const estrategiaDB = await estrategiasQuerys.guardarEstrategiaQuery(estrategia);

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
    const estrategia = await estrategiasQuerys.getEstrategiaPorIdQuery(id);

    if (!estrategia) {
      return res.status(404).json({
        ok: true,
        msg: "Estrategia no encontrada por id",
      });
    }

    const cambiosEstrategia = {
      ...req.body,
      usuario: uid,
    };
    const estrategiaActualizado = estrategiasQuerys.actualizarEstrategiaPorIdQuery(id,cambiosEstrategia);
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
    const estrategia = await estrategiasQuerys.getEstrategiaPorIdQuery(id);

    if (!estrategia) {
      return res.status(404).json({
        ok: true,
        msg: "Estrategia no encontrado por id",
      });
    }

    await estrategiasQuerys.borrarEstrategiaPorIdQuery(id);

    res.json({
      ok: true,
      msg: "Estrategia borrada",
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

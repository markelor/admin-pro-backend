const { response } = require("express");

const Deporte = require("../../models/mantenimientos/deporte");
const deportesQuerys = require("../../querys/mantenimientos/deportes");
const getDeportes = async (req, res = response) => {
  try {
    const deportes=await deportesQuerys.getDeportesQuery();
    res.json({
      ok: true,
      deportes,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const crearDeporte = async (req, res = response) => {
  const uid = req.uid;
  const deporte = new Deporte({
    usuario: uid,
    ...req.body,
  });

  try {
    const existeNombre =
      await deportesQuerys.getDeportePorNombreQuery(
        deporte.nombre
      );
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "El deporte ya está registrado",
      });
    }
    const deporteDB =await deportesQuerys.guardarDeporteQuery(deporte);
    res.json({
      ok: true,
      deporte: deporteDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarDeporte = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const deporte = await deportesQuerys.getDeportePorIdQuery(id);
    if (!deporte) {
      return res.status(404).json({
        ok: true,
        msg: "Deporte no encontrado por id",
      });
    }

    const cambiosDeporte = {
      ...req.body,
      usuario: uid,
    };

    const deporteActualizado =await deportesQuerys.actualizarDeportePorIdQuery(id,cambiosDeporte)

    res.json({
      ok: true,
      deporte: deporteActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarDeporte = async (req, res = response) => {
  const id = req.params.id;

  try {
   const deporte = await deportesQuerys.getDeportePorIdQuery(id);

    if (!deporte) {
      return res.status(404).json({
        ok: true,
        msg: "Deporte no encontrado por id",
      });
    }

    await await deportesQuerys.borrarDeportePorIdQuery(id);

    res.json({
      ok: true,
      msg: "Deporte eliminado",
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
  getDeportes,
  crearDeporte,
  actualizarDeporte,
  borrarDeporte,
};

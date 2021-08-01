const { response } = require("express");

const Deporte = require("../models/deporte");

const getDeportes = async (req, res = response) => {
  const deportes = await Deporte.find().populate("usuario", "nombre img");

  res.json({
    ok: true,
    deportes,
  });
};

const crearDeporte = async (req, res = response) => {
  const uid = req.uid;
  const deporte = new Deporte({
    usuario: uid,
    ...req.body,
  });

  try {
    const deporteDB = await deporte.save();

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
    const deporte = await Deporte.findById(id);

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

    const deporteActualizado = await Deporte.findByIdAndUpdate(
      id,
      cambiosDeporte,
      { new: true }
    );

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
    const deporte = await Deporte.findById(id);

    if (!deporte) {
      return res.status(404).json({
        ok: true,
        msg: "Deporte no encontrado por id",
      });
    }

    await Deporte.findByIdAndDelete(id);

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

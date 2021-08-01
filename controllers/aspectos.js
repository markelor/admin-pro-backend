const { response } = require("express");

const Aspecto = require("../models/aspecto");

const getAspectos = async (req, res = response) => {
  const aspectos = await Aspecto.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");

  res.json({
    ok: true,
    aspectos,
  });
};

const getAspectoById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const aspecto = await Aspecto.findById(id)
      .populate("usuario", "nombre img")
      .populate("deporte", "nombre img");

    res.json({
      ok: true,
      aspecto,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearAspecto = async (req, res = response) => {
  const uid = req.uid;
  const aspecto = new Aspecto({
    usuario: uid,
    ...req.body,
  });

  try {
    const aspectoDB = await aspecto.save();

    res.json({
      ok: true,
      aspecto: aspectoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarAspecto = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const aspecto = await Aspecto.findById(id);

    if (!aspecto) {
      return res.status(404).json({
        ok: true,
        msg: "Aspecto no encontrado por id",
      });
    }

    const cambiosAspecto = {
      ...req.body,
      usuario: uid,
    };

    const aspectoActualizado = await Aspecto.findByIdAndUpdate(
      id,
      cambiosAspecto,
      { new: true }
    );

    res.json({
      ok: true,
      aspecto: aspectoActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarAspecto = async (req, res = response) => {
  const id = req.params.id;

  try {
    const aspecto = await Aspecto.findById(id);

    if (!aspecto) {
      return res.status(404).json({
        ok: true,
        msg: "Aspecto no encontrado por id",
      });
    }

    await Aspecto.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Aspecto borrado",
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
  getAspectos,
  crearAspecto,
  actualizarAspecto,
  borrarAspecto,
  getAspectoById,
};

const { response } = require("express");

const CuerpoCeleste = require("../../models/mantenimientos/cuerpo-celeste");

const getCuerposCelestes = async (req, res = response) => {
  const cuerposCelestes = await CuerpoCeleste.find().populate(
    "usuario",
    "nombre img"
  );
  res.json({
    ok: true,
    cuerposCelestes,
  });
};

const getCuerpoCelesteById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const cuerpoCeleste = await CuerpoCeleste.findById(id).populate(
      "usuario",
      "nombre img"
    );

    res.json({
      ok: true,
      cuerpoCeleste,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearCuerpoCeleste = async (req, res = response) => {
  const uid = req.uid;
  const cuerpoCeleste = new CuerpoCeleste({
    usuario: uid,
    ...req.body,
  });

  try {
    const existeNombre = await CuerpoCeleste.findOne({ nombre:cuerpoCeleste.nombre });
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "El cuerpo celeste ya está registrado",
      });
    }
    const cuerpoCelesteDB = await cuerpoCeleste.save();

    res.json({
      ok: true,
      cuerpoCeleste: cuerpoCelesteDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarCuerpoCeleste = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const cuerpoCeleste = await CuerpoCeleste.findById(id);

    if (!cuerpoCeleste) {
      return res.status(404).json({
        ok: true,
        msg: "Relacion planetaria no encontrada por id",
      });
    }

    const cambiosCuerpoCeleste = {
      ...req.body,
      usuario: uid,
    };

    const cuerpoCelesteActualizado =
      await CuerpoCeleste.findByIdAndUpdate(
        id,
        cambiosCuerpoCeleste,
        { new: true }
      );

    res.json({
      ok: true,
      cuerpoCeleste: cuerpoCelesteActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarCuerpoCeleste = async (req, res = response) => {
  const id = req.params.id;

  try {
    const cuerpoCeleste = await CuerpoCeleste.findById(id);

    if (!cuerpoCeleste) {
      return res.status(404).json({
        ok: true,
        msg: "Relacion planetaria no encontrado por id",
      });
    }

    await CuerpoCeleste.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Relacion planetaria borrada",
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
  getCuerposCelestes,
  crearCuerpoCeleste,
  actualizarCuerpoCeleste,
  borrarCuerpoCeleste,
  getCuerpoCelesteById,
};

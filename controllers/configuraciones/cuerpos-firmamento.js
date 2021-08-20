const { response } = require("express");

const CuerpoFirmamento = require("../../models/configuraciones/cuerpo-firmamento");

const getCuerposFirmamento = async (req, res = response) => {
  const cuerposFirmamento = await CuerpoFirmamento.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");

  res.json({
    ok: true,
    cuerposFirmamento
  });
};

const getCuerpoFirmamentoById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const cuerpoFirmamento = await CuerpoFirmamento.findById(id)
      .populate("usuario", "nombre img")
      .populate("configCuerposCelestes.cuerpoCeleste");

    res.json({
      ok: true,
      cuerpoFirmamento,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearCuerpoFirmamento = async (req, res = response) => {
  const uid = req.uid;
  const cuerpoFirmamento = new CuerpoFirmamento({
    usuario: uid,
    ...req.body,
  });

  try {
    const existeNombre = await CuerpoFirmamento.findOne({ nombre:cuerpoFirmamento.nombre });
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "El cuerpo firmamento ya está registrado",
      });
    }
    const cuerpoFirmamentoDB = await cuerpoFirmamento.save();

    res.json({
      ok: true,
      cuerpoFirmamento: cuerpoFirmamentoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarCuerpoFirmamento = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const cuerpoFirmamento = await CuerpoFirmamento.findById(id);

    if (!cuerpoFirmamento) {
      return res.status(404).json({
        ok: true,
        msg: "Cuerpo firmamento no encontrado por id",
      });
    }

    const cambiosCuerpoFirmamento = {
      ...req.body,
      usuario: uid,
    };

    const cuerpoFirmamentoActualizado = await CuerpoFirmamento.findByIdAndUpdate(
      id,
      cambiosCuerpoFirmamento,
      { new: true }
    );

    res.json({
      ok: true,
      cuerpoFirmamento: cuerpoFirmamentoActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarCuerpoFirmamento = async (req, res = response) => {
  const id = req.params.id;

  try {
    const cuerpoFirmamento = await CuerpoFirmamento.findById(id);

    if (!cuerpoFirmamento) {
      return res.status(404).json({
        ok: true,
        msg: "Cuerpo firmamento no encontrado por id",
      });
    }

    await CuerpoFirmamento.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Cuerpo firmamento borrado",
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
  getCuerposFirmamento,
  crearCuerpoFirmamento,
  actualizarCuerpoFirmamento,
  borrarCuerpoFirmamento,
  getCuerpoFirmamentoById,
};

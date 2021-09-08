const { response } = require("express");
const cuerposFirmamentoQuerys = require("../../querys/configuraciones/cuerpos-firmamento");
const CuerpoFirmamento = require("../../models/configuraciones/cuerpo-firmamento");
const getCuerposFirmamento = async (req, res = response) => {
  try {
    const cuerposFirmamento =
      await cuerposFirmamentoQuerys.getCuerposFirmamentoQuery();
    res.json({
      ok: true,
      cuerposFirmamento,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getCuerpoFirmamentoById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const cuerpoFirmamento = await cuerposFirmamentoQuerys.getCuerpoFirmamentoPorIdQuery(id);
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
    const existeNombre = await cuerposFirmamentoQuerys.getCuerpoFirmamentoPorNombreQuery(cuerpoFirmamento.nombre);
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "El cuerpo firmamento ya está registrado",
      });
    }
    const cuerpoFirmamentoDB = await cuerposFirmamentoQuerys.guardarCuerpoFirmamentoQuery(cuerpoFirmamento);

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
    const cuerpoFirmamento = await cuerposFirmamentoQuerys.getCuerpoFirmamentoPorIdQuery(id);

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

    const cuerpoFirmamentoActualizado = await cuerposFirmamentoQuerys.actualizarCuerpoFirmamentoPorIdQuery(id,cambiosCuerpoFirmamento)

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
    const cuerpoFirmamento = await cuerposFirmamentoQuerys.getCuerpoFirmamentoPorIdQuery(id);

    if (!cuerpoFirmamento) {
      return res.status(404).json({
        ok: true,
        msg: "Cuerpo firmamento no encontrado por id",
      });
    }
    await cuerposFirmamentoQuerys.borrarCuerpoFirmamentoPorIdQuery(id);

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

const { response } = require("express");

const RelacionPlanetaria = require("../../models/configuraciones/relacion-planetaria");

const getRelacionesPlanetarias = async (req, res = response) => {
  const relacionesPlanetarias = await RelacionPlanetaria.find().populate(
    "usuario",
    "nombre img"
  );
  res.json({
    ok: true,
    relacionesPlanetarias,
  });
};

const getRelacionPlanetariaById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const relacionPlanetaria = await RelacionPlanetaria.findById(id).populate(
      "usuario",
      "nombre img"
    );

    res.json({
      ok: true,
      relacionPlanetaria,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearRelacionPlanetaria = async (req, res = response) => {
  const uid = req.uid;
  const relacionPlanetaria = new RelacionPlanetaria({
    usuario: uid,
    ...req.body,
  });

  try {
    const existeNombre = await RelacionPlanetaria.findOne({ nombre:relacionPlanetaria.nombre });
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "La relación planetaria ya está registrado",
      });
    }
    const relacionPlanetariaDB = await relacionPlanetaria.save();

    res.json({
      ok: true,
      relacionPlanetaria: relacionPlanetariaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarRelacionPlanetaria = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const relacionPlanetaria = await RelacionPlanetaria.findById(id);

    if (!relacionPlanetaria) {
      return res.status(404).json({
        ok: true,
        msg: "Relacion planetaria no encontrada por id",
      });
    }

    const cambiosRelacionPlanetaria = {
      ...req.body,
      usuario: uid,
    };

    const relacionPlanetariaActualizado =
      await RelacionPlanetaria.findByIdAndUpdate(
        id,
        cambiosRelacionPlanetaria,
        { new: true }
      );

    res.json({
      ok: true,
      relacionPlanetaria: relacionPlanetariaActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarRelacionPlanetaria = async (req, res = response) => {
  const id = req.params.id;

  try {
    const relacionPlanetaria = await RelacionPlanetaria.findById(id);

    if (!relacionPlanetaria) {
      return res.status(404).json({
        ok: true,
        msg: "Relacion planetaria no encontrado por id",
      });
    }

    await RelacionPlanetaria.findByIdAndDelete(id);

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
  getRelacionesPlanetarias,
  crearRelacionPlanetaria,
  actualizarRelacionPlanetaria,
  borrarRelacionPlanetaria,
  getRelacionPlanetariaById,
};

const { response } = require("express");

const CompatibilidadPlanetaria = require("../../models/configuraciones/compatibilidad-planetaria");

const getCompatibilidadesPlanetarias = async (req, res = response) => {
  const compatibilidadesPlanetarias = await CompatibilidadPlanetaria.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");

  res.json({
    ok: true,
    compatibilidadesPlanetarias,
  });
};

const getCompatibilidadPlanetariaById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const compatibilidadPlanetaria = await CompatibilidadPlanetaria.findById(id)
      .populate("usuario", "nombre img")
      .populate("deporte", "nombre img");

    res.json({
      ok: true,
      compatibilidadPlanetaria,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearCompatibilidadPlanetaria = async (req, res = response) => {
  const uid = req.uid;
  const compatibilidadPlanetaria = new CompatibilidadPlanetaria({
    usuario: uid,
    ...req.body,
  });

  try {
    const existeNombre = await CompatibilidadPlanetaria.findOne({ nombre:compatibilidadPlanetaria.nombre });
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "La compatibilidad planetaria ya está registrada",
      });
    }
    const compatibilidadPlanetariaDB = await compatibilidadPlanetaria.save();

    res.json({
      ok: true,
      compatibilidadPlanetaria: compatibilidadPlanetariaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarCompatibilidadPlanetaria = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const compatibilidadPlanetaria = await CompatibilidadPlanetaria.findById(id);

    if (!compatibilidadPlanetaria) {
      return res.status(404).json({
        ok: true,
        msg: "Compatibilidad planetaria no encontrada por id",
      });
    }

    const cambiosCompatibilidadPlanetaria = {
      ...req.body,
      usuario: uid,
    };

    const compatibilidadPlanetariaActualizado = await CompatibilidadPlanetaria.findByIdAndUpdate(
      id,
      cambiosCompatibilidadPlanetaria,
      { new: true }
    );

    res.json({
      ok: true,
      compatibilidadPlanetaria: compatibilidadPlanetariaActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarCompatibilidadPlanetaria = async (req, res = response) => {
  const id = req.params.id;

  try {
    const compatibilidadPlanetaria = await CompatibilidadPlanetaria.findById(id);

    if (!compatibilidadPlanetaria) {
      return res.status(404).json({
        ok: true,
        msg: "Compatibilidad planetaria no encontrado por id",
      });
    }

    await CompatibilidadPlanetaria.findByIdAndDelete(id);

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
  getCompatibilidadesPlanetarias,
  crearCompatibilidadPlanetaria,
  actualizarCompatibilidadPlanetaria,
  borrarCompatibilidadPlanetaria,
  getCompatibilidadPlanetariaById,
};

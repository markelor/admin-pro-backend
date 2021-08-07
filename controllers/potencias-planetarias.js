const { response } = require("express");

const PotenciaPlanetaria = require("../models/potencia-planetaria");

const getPotenciasPlanetarias = async (req, res = response) => {
  const potenciasPlanetarias = await PotenciaPlanetaria.find()
    .populate("usuario", "nombre img")
    .populate("deporte", "nombre img");

  res.json({
    ok: true,
    potenciasPlanetarias,
  });
};

const getPotenciaPlanetariaById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const potenciaPlanetaria = await PotenciaPlanetaria.findById(id)
      .populate("usuario", "nombre img")
      .populate("deporte", "nombre img");

    res.json({
      ok: true,
      potenciaPlanetaria,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const crearPotenciaPlanetaria = async (req, res = response) => {
  const uid = req.uid;
  const potenciaPlanetaria = new PotenciaPlanetaria({
    usuario: uid,
    ...req.body,
  });

  try {
    const potenciaPlanetariaDB = await potenciaPlanetaria.save();

    res.json({
      ok: true,
      potenciaPlanetaria: potenciaPlanetariaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarPotenciaPlanetaria = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const potenciaPlanetaria = await PotenciaPlanetaria.findById(id);

    if (!potenciaPlanetaria) {
      return res.status(404).json({
        ok: true,
        msg: "Potencia planetaria no encontrada por id",
      });
    }

    const cambiosPotenciaPlanetaria = {
      ...req.body,
      usuario: uid,
    };

    const potenciaPlanetariaActualizado = await PotenciaPlanetaria.findByIdAndUpdate(
      id,
      cambiosPotenciaPlanetaria,
      { new: true }
    );

    res.json({
      ok: true,
      potenciaPlanetaria: potenciaPlanetariaActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarPotenciaPlanetaria = async (req, res = response) => {
  const id = req.params.id;

  try {
    const potenciaPlanetaria = await PotenciaPlanetaria.findById(id);

    if (!potenciaPlanetaria) {
      return res.status(404).json({
        ok: true,
        msg: "Potencia planetaria no encontrado por id",
      });
    }

    await PotenciaPlanetaria.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Potencia planetaria borrada",
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
  getPotenciasPlanetarias,
  crearPotenciaPlanetaria,
  actualizarPotenciaPlanetaria,
  borrarPotenciaPlanetaria,
  getPotenciaPlanetariaById,
};

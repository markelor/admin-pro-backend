const { response } = require("express");

const CompatibilidadPlanetaria = require("../../models/configuraciones/compatibilidad-planetaria");
const compatibilidadesPlanetariasQuerys = require("../../querys/configuraciones/compatibilidades-planetarias");

const getCompatibilidadesPlanetarias = async (req, res = response) => {
  try {
    const compatibilidadesPlanetarias =
      await compatibilidadesPlanetariasQuerys.getCompatibilidadesPlanetariasQuery();
    res.json({
      ok: true,
      compatibilidadesPlanetarias,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getCompatibilidadPlanetariaById = async (req, res = response) => {
  const id = req.params.id;
  try {
    const compatibilidadPlanetaria =
      await compatibilidadesPlanetariasQuerys.getCompatibilidadPlanetariaPorIdQuery(
        id
      );
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
    const existeNombre =
      await compatibilidadesPlanetariasQuerys.getCompatibilidadPlanetariaPorNombreQuery(
        compatibilidadPlanetaria.nombre
      );
    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "La compatibilidad planetaria ya está registrada",
      });
    }
    const compatibilidadPlanetariaDB =
      await compatibilidadesPlanetariasQuerys.guardarCompatibilidadPlanetariaQuery(compatibilidadPlanetaria);
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
    const compatibilidadPlanetaria =
      await compatibilidadesPlanetariasQuerys.getCompatibilidadPlanetariaPorIdQuery(
        id
      );

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
    const compatibilidadPlanetariaActualizado =
      await compatibilidadesPlanetariasQuerys.actualizarCompatibilidadPlanetariaPorIdQuery(
        id,
        cambiosCompatibilidadPlanetaria
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
    const compatibilidadPlanetaria = await compatibilidadesPlanetariasQuerys.getCompatibilidadPlanetariaPorIdQuery(
      id
    );

    if (!compatibilidadPlanetaria) {
      return res.status(404).json({
        ok: true,
        msg: "Compatibilidad planetaria no encontrado por id",
      });
    }
    await compatibilidadesPlanetariasQuerys.borrarCompatibilidadPlanetariaPorIdQuery(
      id
    );
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

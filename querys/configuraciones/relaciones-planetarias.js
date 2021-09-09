

const RelacionPlanetaria = require("../../models/configuraciones/relacion-planetaria");

const getRelacionesPlanetariasQuery = async () => {
  return await RelacionPlanetaria.find().populate(
    "usuario",
    "nombre img"
  );
};

const getRelacionPlanetariaPorIdQuery = async (id) => {
  return await RelacionPlanetaria.findById(id).populate(
    "usuario",
    "nombre img"
  );
};
const getRelacionPlanetariaPorNombreQuery = async (nombre) => {
  return await RelacionPlanetaria.findOne({
    nombre: nombre,
  });
};

const guardarRelacionPlanetariaQuery = async (
  relacionPlanetaria
) => {
  return await relacionPlanetaria.save();
};
const actualizarRelacionPlanetariaPorIdQuery = async (
  id,
  cambiosRelacionPlanetaria
) => {
  return await RelacionPlanetaria.findByIdAndUpdate(
    id,
    cambiosRelacionPlanetaria,
    { new: true }
  );
};

const borrarRelacionPlanetariaPorIdQuery = async (id) => {
  return await RelacionPlanetaria.findByIdAndDelete(id);
};

module.exports = {
  getRelacionesPlanetariasQuery,
  getRelacionPlanetariaPorIdQuery,
  getRelacionPlanetariaPorNombreQuery,
  guardarRelacionPlanetariaQuery,
  actualizarRelacionPlanetariaPorIdQuery,
  borrarRelacionPlanetariaPorIdQuery
};
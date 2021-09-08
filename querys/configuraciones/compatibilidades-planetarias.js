const CompatibilidadPlanetaria = require("../../models/configuraciones/compatibilidad-planetaria");

const getCompatibilidadesPlanetariasQuery = async () => {
  return await CompatibilidadPlanetaria.find().populate(
    "usuario",
    "nombre img"
  );
};

const getCompatibilidadPlanetariaPorIdQuery = async (id) => {
  return await CompatibilidadPlanetaria.findById(id).populate(
    "usuario",
    "nombre img"
  );
};
const getCompatibilidadPlanetariaPorNombreQuery = async (nombre) => {
  return await CompatibilidadPlanetaria.findOne({
    nombre: nombre,
  });
};

const guardarCompatibilidadPlanetariaQuery = async (
  compatibilidadPlanetaria
) => {
  return await compatibilidadPlanetaria.save();
};
const actualizarCompatibilidadPlanetariaPorIdQuery = async (
  id,
  cambiosCompatibilidadPlanetaria
) => {
  return await CompatibilidadPlanetaria.findByIdAndUpdate(
    id,
    cambiosCompatibilidadPlanetaria,
    { new: true }
  );
};

const borrarCompatibilidadPlanetariaPorIdQuery = async (id) => {
  return await CompatibilidadPlanetaria.findByIdAndDelete(id);
};

module.exports = {
  getCompatibilidadesPlanetariasQuery,
  getCompatibilidadPlanetariaPorIdQuery,
  getCompatibilidadPlanetariaPorNombreQuery,
  guardarCompatibilidadPlanetariaQuery,
  actualizarCompatibilidadPlanetariaPorIdQuery,
  borrarCompatibilidadPlanetariaPorIdQuery
};

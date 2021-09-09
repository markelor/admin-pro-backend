const CuerpoCeleste = require("../../models/mantenimientos/cuerpo-celeste");

const getCuerposCelestesQuery = async () => {
  return await CuerpoCeleste.find().populate(
    "usuario",
    "nombre img"
  );
};

const getCuerpoCelestePorIdQuery = async (id) => {
  return await CuerpoCeleste.findById(id).populate(
    "usuario",
    "nombre img"
  );
};
const getCuerpoCelestePorNombreQuery = async (nombre) => {
  return await CuerpoCeleste.findOne({
    nombre: nombre,
  });
};

const guardarCuerpoCelesteQuery = async (
  cuerpoCeleste
) => {
  return await cuerpoCeleste.save();
};
const actualizarCuerpoCelestePorIdQuery = async (
  id,
  cambiosCuerpoCeleste
) => {
  return await CuerpoCeleste.findByIdAndUpdate(
    id,
    cambiosCuerpoCeleste,
    { new: true }
  );
};

const borrarCuerpoCelestePorIdQuery = async (id) => {
  return await CuerpoCeleste.findByIdAndDelete(id);
};

module.exports = {
  getCuerposCelestesQuery,
  getCuerpoCelestePorIdQuery,
  getCuerpoCelestePorNombreQuery,
  guardarCuerpoCelesteQuery,
  actualizarCuerpoCelestePorIdQuery,
  borrarCuerpoCelestePorIdQuery
};

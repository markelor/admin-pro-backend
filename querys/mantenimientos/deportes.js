const Deporte = require("../../models/mantenimientos/deporte");

const getDeportesQuery = async () => {
  return await Deporte.find().populate(
    "usuario",
    "nombre img"
  );
};

const getDeportePorIdQuery = async (id) => {
  return await Deporte.findById(id).populate(
    "usuario",
    "nombre img"
  );
};
const getDeportePorNombreQuery = async (nombre) => {
  return await Deporte.findOne({
    nombre: nombre,
  });
};

const guardarDeporteQuery = async (
  Deporte
) => {
  return await Deporte.save();
};
const actualizarDeportePorIdQuery = async (
  id,
  cambiosDeporte
) => {
  return await Deporte.findByIdAndUpdate(
    id,
    cambiosDeporte,
    { new: true }
  );
};

const borrarDeportePorIdQuery = async (id) => {
  return await Deporte.findByIdAndDelete(id);
};

module.exports = {
  getDeportesQuery,
  getDeportePorIdQuery,
  getDeportePorNombreQuery,
  guardarDeporteQuery,
  actualizarDeportePorIdQuery,
  borrarDeportePorIdQuery
};

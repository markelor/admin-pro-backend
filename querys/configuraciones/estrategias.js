const Estrategia = require("../../models/configuraciones/estrategia");

const getEstrategiasQuery = async () => {
  return await Estrategia.find()
    .populate("usuario", "nombre img")
    .populate({
      path: "cuerposFirmamentoNatal",
      model: "CuerpoFirmamento",
      populate: {
        path: "configCuerposCelestes.cuerpoCeleste",
        model: "CuerpoCeleste",
      },
    })
    .populate({
      path: "cuerposFirmamentoTransitos",
      model: "CuerpoFirmamento",
      populate: {
        path: "configCuerposCelestes.cuerpoCeleste",
        model: "CuerpoCeleste",
      },
    })
    .populate("compatibilidadesPlanetarias")
    .populate("relacionesPlanetarias");
};

const getEstrategiaPorIdQuery = async (id) => {
  return await Estrategia.findById(id).populate(
    "usuario",
    "nombre img"
  );
};

const getEstrategiaPorNombreQuery = async (nombre) => {
  return await Estrategia.findOne({
    nombre: nombre,
  });
};

const guardarEstrategiaQuery = async (
  estrategia
) => {
  return await estrategia.save();
};

const actualizarEstrategiaPorIdQuery = async (
  id,
  cambiosEstrategia
) => {
  return await Estrategia.findByIdAndUpdate(
    id,
    cambiosEstrategia,
    { new: true }
  );
};

const borrarEstrategiaPorIdQuery = async (id) => {
  return await Estrategia.findByIdAndDelete(id);
};

module.exports = {
  getEstrategiasQuery,
  getEstrategiaPorNombreQuery,
  getEstrategiaPorIdQuery,
  guardarEstrategiaQuery,
  actualizarEstrategiaPorIdQuery,
  borrarEstrategiaPorIdQuery
};

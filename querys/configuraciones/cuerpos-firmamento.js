const CuerpoFirmamento = require("../../models/configuraciones/cuerpo-firmamento");

const getCuerposFirmamentoQuery = async () => {
  return await CuerpoFirmamento.find()
    .populate("usuario", "nombre img")

  
};

const getCuerpoFirmamentoPorIdQuery = async (id) => {
    return await CuerpoFirmamento.findById(id).populate(
      "usuario",
      "nombre img"
    );
};
const getCuerpoFirmamentoPorNombreQuery = async (nombre) => {
  return await CuerpoFirmamento.findOne({
    nombre: nombre,
  });
};
const guardarCuerpoFirmamentoQuery = async (
  cuerpoFirmamento
) => {
  return await cuerpoFirmamento.save();
};


const actualizarCuerpoFirmamentoPorIdQuery = async ( id,
  cambiosCuerpoFirmamento) => {
  return await CuerpoFirmamento.findByIdAndUpdate(
    id,
    cambiosCuerpoFirmamento,
    { new: true }
  );
};
const borrarCuerpoFirmamentoPorIdQuery = async (id) => {
  return await CuerpoFirmamento.findByIdAndDelete(id);
};



module.exports = {
  getCuerposFirmamentoQuery,
  getCuerpoFirmamentoPorIdQuery,
  getCuerpoFirmamentoPorNombreQuery,
  guardarCuerpoFirmamentoQuery,
  actualizarCuerpoFirmamentoPorIdQuery,
  borrarCuerpoFirmamentoPorIdQuery
};

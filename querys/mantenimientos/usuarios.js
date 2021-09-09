const Usuario = require("../../models/mantenimientos/usuario");

const getUsuariosQuery = async (desde,limite) => {
  return await Promise.all([
    Usuario.find({}, "nombre email role google img").skip(desde).limit(limite),
    Usuario.countDocuments(),
  ]);
};

const getUsuarioPorIdQuery = async (id) => {
  return await Usuario.findById(id).populate(
    "usuario",
    "nombre img"
  );
};
const getUsuarioPorEmailQuery = async (email) => {
  return await Usuario.findOne({
    email: email,
  });
};

const guardarUsuarioQuery = async (
  usuario
) => {
  return await usuario.save();
};
const actualizarUsuarioPorIdQuery = async (
  id,
  cambiosUsuario
) => {
  return await Usuario.findByIdAndUpdate(
    id,
    cambiosUsuario,
    { new: true }
  );
};

const borrarUsuarioPorIdQuery = async (id) => {
  return await Usuario.findByIdAndDelete(id);
};

module.exports = {
  getUsuariosQuery,
  getUsuarioPorIdQuery,
  getUsuarioPorEmailQuery,
  guardarUsuarioQuery,
  actualizarUsuarioPorIdQuery,
  borrarUsuarioPorIdQuery
};

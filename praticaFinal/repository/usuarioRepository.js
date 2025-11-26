
const Usuario = require("../models/usuarioModel");

async function criarUsuario(dados) {
  return Usuario.create(dados);
}

async function buscarPorEmail(email) {
  return Usuario.findOne({ email });
}

async function buscarPorId(id) {
  return Usuario.findById(id);
}

module.exports = {
  criarUsuario,
  buscarPorEmail,
  buscarPorId
};

const mongoose = require('mongoose');

const ContatoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String },
    senha: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contato', ContatoSchema);

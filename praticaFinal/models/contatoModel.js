const mongoose = require("mongoose");

const contatoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    telefone: { type: String },
    senha: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contato", contatoSchema);

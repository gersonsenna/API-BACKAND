const mongoose = require("mongoose");

const tarefaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, minlength: 3 },
  descricao: { type: String, required: true },
  status: { type: String, enum: ["pendente", "em andamento", "concluida"], default: "pendente" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tarefa", tarefaSchema);

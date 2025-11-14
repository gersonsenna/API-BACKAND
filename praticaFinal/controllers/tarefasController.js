const Tarefa = require("../models/tarefaModel");

exports.criar = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const novaTarefa = await Tarefa.create({ titulo, descricao });
    res.status(201).json(novaTarefa);
  } catch (err) {
    res.status(422).json({ msg: "Título é obrigatório" });
  }
};

exports.listar = async (req, res) => {
  const tarefas = await Tarefa.find();
  res.status(200).json(tarefas);
};

exports.buscar = async (req, res, next) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: "Parâmetro inválido" });

  const tarefa = await Tarefa.findById(id);
  if (!tarefa) return res.status(404).json({ msg: "Tarefa não encontrada" });

  req.tarefa = tarefa;
  next();
};


exports.exibir = (req, res) => res.status(200).json(req.tarefa);


exports.atualizar = async (req, res) => {
  try {
    const { titulo, descricao, status } = req.body;
    const tarefa = req.tarefa;
    tarefa.titulo = titulo || tarefa.titulo;
    tarefa.descricao = descricao || tarefa.descricao;
    tarefa.status = status || tarefa.status;
    await tarefa.save();
    res.status(200).json(tarefa);
  } catch (err) {
    res.status(422).json({ msg: "Título é obrigatório" });
  }
};


exports.remover = async (req, res) => {
  await req.tarefa.remove();
  res.status(204).send();
};

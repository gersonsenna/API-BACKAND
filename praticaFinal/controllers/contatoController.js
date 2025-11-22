const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Contato = require('../models/contatoModel');

exports.registrar = async (req, res) => {
  try {
    const { nome, email, telefone, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ erro: 'Campos obrigatórios.' });

    const existe = await Contato.findOne({ email });
    if (existe) return res.status(400).json({ erro: 'Email já cadastrado.' });

    const hash = await bcrypt.hash(senha, 10);

    const novo = await Contato.create({
      nome,
      email,
      telefone,
      senha: hash
    });

    const token = jwt.sign({ id: novo._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ mensagem: 'Registrado com sucesso', token });
  } catch {
    res.status(500).json({ erro: 'Erro interno.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Campos obrigatórios.' });

    const contato = await Contato.findOne({ email });
    if (!contato) return res.status(401).json({ erro: 'Credenciais inválidas.' });

    const ok = await bcrypt.compare(senha, contato.senha);
    if (!ok) return res.status(401).json({ erro: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: contato._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ mensagem: 'Login realizado', token });
  } catch {
    res.status(500).json({ erro: 'Erro interno.' });
  }
};

exports.listar = async (req, res) => {
  try {
    const contatos = await Contato.find({ _id: req.usuarioId }).select('-senha');
    res.json(contatos);
  } catch {
    res.status(500).json({ erro: 'Erro interno.' });
  }
};

exports.buscar = async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== req.usuarioId) return res.status(403).json({ erro: 'Acesso negado.' });

    const contato = await Contato.findById(id).select('-senha');
    if (!contato) return res.status(404).json({ erro: 'Não encontrado.' });

    res.json(contato);
  } catch {
    res.status(500).json({ erro: 'Erro interno.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== req.usuarioId) return res.status(403).json({ erro: 'Acesso negado.' });

    const dados = { ...req.body };
    delete dados.senha;

    const contato = await Contato.findByIdAndUpdate(id, dados, { new: true }).select('-senha');
    if (!contato) return res.status(404).json({ erro: 'Não encontrado.' });

    res.json({ mensagem: 'Atualizado', contato });
  } catch {
    res.status(500).json({ erro: 'Erro interno.' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== req.usuarioId) return res.status(403).json({ erro: 'Acesso negado.' });

    await Contato.findByIdAndDelete(id);

    res.status(204).send();
  } catch {
    res.status(500).json({ erro: 'Erro interno.' });
  }
};

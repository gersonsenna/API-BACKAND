const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ erro: 'nome, email e senha são obrigatórios' });
    const existente = await Usuario.findOne({ email });
    if (existente) return res.status(400).json({ erro: 'email já cadastrado' });
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const usuario = new Usuario({ nome, email, senha: senhaHash });
    await usuario.save();
    const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', token });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'email e senha são obrigatórios' });
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    return res.status(200).json({ mensagem: 'Login realizado com sucesso', token });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno' });
  }
};

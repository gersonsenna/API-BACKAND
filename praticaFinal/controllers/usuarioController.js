const usuarioRepository = require("../repository/usuarioRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const existe = await usuarioRepository.buscarPorEmail(email);
    if (existe) {
      return res.status(400).json({ mensagem: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await usuarioRepository.criarUsuario({
      nome,
      email,
      senha: senhaHash
    });

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      usuario: { id: usuario._id, nome, email }
    });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

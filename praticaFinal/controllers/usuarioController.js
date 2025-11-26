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

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      return res.status(400).json({ mensagem: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

module.exports = { registrar, login };

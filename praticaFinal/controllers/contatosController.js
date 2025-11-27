const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Contato = require("../models/contatoModel");

// REGISTRO
exports.registrar = async (req, res) => {
  try {
    const { nome, email, telefone, senha } = req.body;

    // Validar campos básicos
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }

    // Verificar se o email já existe
    const existe = await Contato.findOne({ email });
    if (existe) {
      return res.status(400).json({ erro: "Email já cadastrado." });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar contato
    const novoContato = await Contato.create({
      nome,
      email,
      telefone,
      senha: senhaHash
    });

    // Gerar token
    const token = jwt.sign(
      { id: novoContato._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      mensagem: "Contato registrado com sucesso",
      token
    });
  } catch (err) {
    return res.status(500).json({ erro: "Erro interno." });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    // Buscar contato
    const contato = await Contato.findOne({ email });
    if (!contato) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    // Validar senha
    const senhaValida = await bcrypt.compare(senha, contato.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    // Gerar token
    const token = jwt.sign(
      { id: contato._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ mensagem: "Login realizado com sucesso", token });
  } catch (err) {
    return res.status(500).json({ erro: "Erro interno." });
  }
};

// LISTAR TODOS OS CONTATOS (SEM SENHA)
exports.listar = async (req, res) => {
  try {
    const contatos = await Contato.find().select("-senha");
    return res.json(contatos);
  } catch {
    return res.status(500).json({ erro: "Erro interno." });
  }
};

// BUSCAR CONTATO ESPECÍFICO (APENAS SE FOR O DONO)
exports.buscar = async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== req.usuarioId) {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    const contato = await Contato.findById(id).select("-senha");

    if (!contato) {
      return res.status(404).json({ erro: "Contato não encontrado." });
    }

    return res.json(contato);
  } catch {
    return res.status(500).json({ erro: "Erro interno." });
  }
};

// ATUALIZAR
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== req.usuarioId) {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    const dados = { ...req.body };
    delete dados.senha; // senha não é atualizada aqui

    const contatoAtualizado = await Contato.findByIdAndUpdate(id, dados, {
      new: true
    }).select("-senha");

    if (!contatoAtualizado) {
      return res.status(404).json({ erro: "Contato não encontrado." });
    }

    return res.json({
      mensagem: "Contato atualizado com sucesso",
      contato: contatoAtualizado
    });
  } catch {
    return res.status(500).json({ erro: "Erro interno." });
  }
};

// DELETAR
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== req.usuarioId) {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    await Contato.findByIdAndDelete(id);

    return res.status(204).send();
  } catch {
    return res.status(500).json({ erro: "Erro interno." });
  }
};

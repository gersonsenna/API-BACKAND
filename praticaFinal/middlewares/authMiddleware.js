const jwt = require("jsonwebtoken");

exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "Não autorizado" });

  const token = authHeader.split(" ")[1];
  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};

exports.gerarToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
  } catch (err) {
    throw new Error("Erro ao gerar o token");
  }
};

const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ mensagem: "Token não informado" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(401).json({ mensagem: "Token inválido" });

    req.usuario = usuario;
    next();
  });
}

module.exports = auth;

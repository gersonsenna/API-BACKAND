const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ erro: "Token ausente." });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido." });
  }
};

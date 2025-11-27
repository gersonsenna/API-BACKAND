const express = require("express");
const router = express.Router();

const controller = require("../controllers/contatosController");
const auth = require("../middlewares/authMiddleware");


router.post("/registrar", controller.registrar);
router.post("/login", controller.login);


router.get("/", auth, controller.listar);
router.get("/:id", auth, controller.buscar);
router.put("/:id", auth, controller.atualizar);
router.delete("/:id", auth, controller.deletar);

module.exports = router;

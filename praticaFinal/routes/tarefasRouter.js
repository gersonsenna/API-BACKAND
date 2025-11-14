const express = require("express");
const tarefasController = require("../controllers/tarefasController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", tarefasController.listar);
router.post("/", authMiddleware.verificarToken, tarefasController.criar);
router.get("/:id", tarefasController.buscar, tarefasController.exibir);
router.put("/:id", authMiddleware.verificarToken, tarefasController.buscar, tarefasController.atualizar);
router.delete("/:id", authMiddleware.verificarToken, tarefasController.buscar, tarefasController.remover);

module.exports = router;

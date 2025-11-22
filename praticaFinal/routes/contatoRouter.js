const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/contatosController');

router.post('/registrar', controller.registrar);
router.post('/login', controller.login);

router.get('/', auth, controller.listar);
router.get('/:id', auth, controller.buscar);
router.put('/:id', auth, controller.atualizar);
router.delete('/:id', auth, controller.deletar);

module.exports = router;

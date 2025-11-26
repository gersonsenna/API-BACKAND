const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware'); 

const { listar, buscar, criar, atualizar, deletar } = require('../controllers/contatosController');

router.get('/', auth, listar); 
router.get('/:id', auth, buscar);

router.post('/', auth, criar); 
router.put('/:id', auth, atualizar);
router.delete('/:id', auth, deletar);

module.exports = router;

const express = require('express');
const { createProjeto, getProjetos, getProjetoById, updateProjeto, deleteProjeto } = require('../controllers/projetosController');
const router = express.Router();

router.post('/send-projects', createProjeto);
router.get('/projects', getProjetos);
router.get('/project/:id', getProjetoById);
router.put('/project/:id', updateProjeto);
router.delete('/project/:id', deleteProjeto);


module.exports = router;
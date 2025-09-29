const express = require('express');
const { createOrUpdatePortifolio, getAllPortifolios, updatePortifolio, deletePortifolio } = require('../controllers/portifolioController')
const router = express.Router();

router.post('/send-portifolio', createOrUpdatePortifolio);
router.get('/portifolio', getAllPortifolios);
router.put('/portifolio/:id', updatePortifolio);
router.delete('/portifolio/:id', deletePortifolio);


module.exports = router;
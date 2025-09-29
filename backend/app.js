const express = require('express');
const cors = require('cors');
const multer = require('multer'); 
const path = require('path');
const connectDB = require('./src/config/dBConnect');
const upload = multer();

const projetosRoutes = require('./src/routes/projetosRoutes');
const portifolioRoutes = require('./src/routes/portifolioRoutes')

const app = express();
const port = process.env.PORT || 2100;

app.use(cors());
app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'front')));

connectDB();

// Rota principal
app.get('/', (req, res) => {
    res.send('Server on!');
});

// ROTA: /backoffice (Apenas envia o index.html)
app.get('/backoffice', (req, res) => {
    const filePath = path.join(__dirname, 'front', 'index.html');
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erro ao enviar o arquivo HTML para /backoffice:', err);
            res.status(404).send('Backoffice indisponível: Arquivo não encontrado.');
        }
    });
});

// Rotas da aplicação
app.use(projetosRoutes);
app.use(portifolioRoutes);

app.listen(port, () => 
    console.log(`Server running on port ${port}`
    ));
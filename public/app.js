// server.js

const express = require('express');
const path = require('path');
const app = express();

// Define a porta como 3050, mas permite que a variável de ambiente PORT sobrescreva (padrão em hospedagem).
const PORT = process.env.PORT || 500; 

// Caminho para a pasta 'build'
const buildPath = path.join(__dirname, 'build');

// 1. Serve os arquivos estáticos (CSS, JS, imagens, etc.) da pasta 'build'
app.use(express.static(buildPath));

// 2. Garante o roteamento SPA (Single Page Application)
// Esta rota precisa estar no final para garantir que todos os arquivos estáticos sejam servidos primeiro.
// Usamos uma expressão mais simples para evitar o PathError anterior:
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// 3. Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor de Produção rodando em http://localhost:${PORT}`);
});
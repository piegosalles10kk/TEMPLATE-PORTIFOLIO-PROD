const mongoose = require('mongoose');

// Função de conexão (DEVE USAR A VARIÁVEL DE AMBIENTE)
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI; 

        if (!mongoUri) {
            console.error("Variável de ambiente MONGO_URI não está definida!");
            return;
        }

        await mongoose.connect(mongoUri, {
            
        });
        console.log('Conectado ao MongoDB!');
        
    } catch (error) {

        console.error('Erro ao se conectar ao MongoDB Local:', error); 

    }
}

module.exports = connectDB;
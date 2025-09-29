const mongoose = require('mongoose');

// Esquema para atualizações do app
const ProjetosSchema = new mongoose.Schema({
    tituloProjeto: { type: String, required: true },
    resumoProjeto: { type: String, required: true },
    tecnologiasProjeto: { 
        backend: [],
        frontend: [],
        dB: [],
        deploy: []
     },
    dataCriacao: { type: Date, required: true },
    imagemProjeto: { type: String, required: true },
    descricaoCompletaProjeto: { type: String, required: true },
    gitHubProjeto: { type: String, required: true },
    deployProjeto: { type: String, required: false }
});

// Esquema para corpo inteiro do portifólio
const corpoPortifolioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cargo: { type: String, required: true },
    sobreMim: { type: String, required: true },
    tecnologias: { 
        backend: [{
            linguagem: { type: String, required: false },
            nivel: { type: Number, required: false }
        }],
        frontend: [{
            linguagem: { type: String, required: false },
            nivel: { type: Number, required: false }
        }],
        dB: [{
            linguagem: { type: String, required: false },
            nivel: { type: Number, required: false }
        }],
        deploy: [{
            linguagem: { type: String, required: false },
            nivel: { type: Number, required: false }
        }],
     },
     experiencia: [{
        empresa: { type: String, required: true },
        cargo: { type: String, required: true },
        tecnologiasUsadas: { 
        backend: [{
            linguagem: { type: String, required: false },
        }],
        frontend: [{
            linguagem: { type: String, required: false },
        }],
        dB: [{
            linguagem: { type: String, required: false },
        }],
        deploy: [{
            linguagem: { type: String, required: false },
        }],
     },
        dataInicio: { type: Date, required: true },
        dataFim: { type: Date, required: false },
        descricao:  { type: String, required: true }
     }],
     github: { type: String, required: false },
     linkedin: { type: String, required: false },
     telefone: { type: String, required: true },
     email: { type: String, required: true },
});


// Modelos
const Projetos = mongoose.model('Projetos', ProjetosSchema);
const Portifolio = mongoose.model('Portifolio', corpoPortifolioSchema);

// Exportação dos Modelos
module.exports = {
    Projetos,
    Portifolio    
};
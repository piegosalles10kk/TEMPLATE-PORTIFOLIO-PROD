// src/services/api.js
const API_URL = 'http://piegosalles-backend.cloud/backend-portifolio'; // URL do backend

export const api = {
    testConnection: async () => {
        try {
            const response = await fetch(`${API_URL}/`); // Chama a rota raiz do backend
            if (response.ok) {
                console.log(`✅ Conexão com o Backend estabelecida: ${API_URL}`);
                return true;
            } else {
                console.error(`⚠️ Conexão com o Backend falhou (Status: ${response.status}). URL: ${API_URL}`);
                return false;
            }
        } catch (error) {
            console.error(`❌ Erro de Rede: Não foi possível alcançar o Backend em ${API_URL}`);
            // O erro mais comum aqui é DNS (backend:2100) ou CORS.
            console.error("Detalhes do erro:", error.message);
            return false;
        }
    },

    getPortfolio: async () => {
        await new Promise(resolve => setTimeout(resolve, 600)); 
        const response = await fetch(`${API_URL}/portifolio`);
        if (!response.ok) throw new Error('Erro ao buscar portfólio. Verifique o servidor JSON.');
        const data = await response.json();
        return data[0]; 
    },
    
    getProjects: async () => {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Erro ao buscar projetos. Verifique o servidor JSON.');
        return response.json();
    },
    
    getProjectById: async (id) => {
        const response = await fetch(`${API_URL}/project/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Projeto não encontrado.');
            }
            throw new Error('Erro ao buscar detalhes do projeto. Verifique o servidor.');
        }
        return response.json();
    }
};

// src/services/index.js
export * from './api';
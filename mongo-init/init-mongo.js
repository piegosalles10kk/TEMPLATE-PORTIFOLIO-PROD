// 1. Mudar para o Banco de Dados 'projetos' (o cria se não existir)
db = db.getSiblingDB('projetos');

// 2. Criar a collection 'projetos'
db.createCollection('projetos');

print("✅ Collection 'projetos' criada no DB 'projetos'.");
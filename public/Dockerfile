# ----------------------------------------
# STAGE ÚNICO: production (Dependente do Build Local)
# ----------------------------------------
FROM node:20-alpine 

# Define o diretório de trabalho
WORKDIR /app

# Instala o pacote 'serve' globalmente. Ele é necessário para rodar o build.
# NOTE: O 'serve' estava nas devDependencies do seu package.json.
RUN npm install -g serve

# Copia a pasta 'build' do seu disco local para dentro do container
# O sucesso deste passo depende de você ter rodado 'npm run build' localmente
COPY build ./build 

# Expõe a porta 500
EXPOSE 500

# Comando para iniciar o servidor na porta 500
CMD ["serve", "-s", "build", "-l", "500"]
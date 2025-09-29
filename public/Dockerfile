# ----------------------------------------
# STAGE 1: builder (Cria a pasta 'build')
# ----------------------------------------
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Adiciona o diretório de binários do Node ao PATH para o 'react-scripts' ser encontrado
ENV PATH /app/node_modules/.bin:$PATH

# Copia e instala as dependências
COPY package.json package-lock.json ./
# Usamos 'ci' para instalações limpas em ambientes de CI/CD
RUN npm ci

# Copia o restante do código
COPY . .

# Roda o comando build, gerando a pasta 'build'
RUN npm run build


# ----------------------------------------
# STAGE 2: production (Serve o build)
# ----------------------------------------
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala o pacote 'serve' globalmente
RUN npm install -g serve

# Copia a pasta 'build' gerada no Stage 1
COPY --from=builder /app/build ./build

# Expõe a porta 500
EXPOSE 500

# Comando para iniciar o servidor na porta 500
CMD ["serve", "-s", "build", "-l", "500"]
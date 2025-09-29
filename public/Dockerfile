# ----------------------------------------
# STAGE 1: Build (Cria a pasta 'build')
# ----------------------------------------
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
# Isso permite que o Docker use o cache se as dependências não mudarem
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo devDependencies)
# Usamos 'ci' para garantir que as versões sejam as do lockfile
RUN npm ci

# Copia o restante dos arquivos do projeto
COPY . .

# Roda o comando build (gera a pasta 'build')
# Este comando usa o react-scripts build, que está nas suas dependências
RUN npm run build


# ----------------------------------------
# STAGE 2: Production (Serve o build)
# ----------------------------------------
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia APENAS as dependências que são necessárias em tempo de execução
# O 'serve' está em devDependencies, então instalamos ele globalmente/diretamente aqui.
RUN npm install -g serve

# Copia a pasta 'build' gerada no Stage 1 (builder)
COPY --from=builder /app/build ./build

# Expõe a porta que será usada pelo 'serve' (3050)
EXPOSE 3050

# Comando para iniciar o servidor. 
# Ele replica o seu script 'npm run start-prod'
# O -s build serve a pasta build, e o -l 3050 define a porta de escuta
CMD ["serve", "-s", "build", "-l", "3050"]
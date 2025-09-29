# Use uma imagem base oficial do Node.js
FROM node:20

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo package.json e package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código para o diretório de trabalho
COPY . .

# Exponha a porta em que o aplicativo será executado (500)
EXPOSE 500

# Defina o comando para rodar a aplicação
CMD ["npm", "start"]
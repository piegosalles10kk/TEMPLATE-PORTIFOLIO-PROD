# Usa a imagem oficial do Node.js, versão LTS
FROM node:20-slim

# Cria o diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json para cache
COPY package*.json ./

# Instala as dependências
# Usa --omit=dev para uma imagem de produção menor, mas você pode omitir se precisar de libs de dev
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que o Express está usando (2100)
EXPOSE 2100

# Comando para iniciar o servidor Node.js
# Certifique-se de que este comando inicia seu app.js
CMD ["node", "app.js"]
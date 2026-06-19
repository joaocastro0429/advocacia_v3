# Usa Node moderno
FROM node:22

# Diretório da aplicação
WORKDIR /app

# Copia package files primeiro
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Gera cliente Prisma
RUN npx prisma generate

# Compila TypeScript
RUN npm run build

# Permissão para o script
RUN chmod +x entrypoint.sh

# Porta usada pelo Render
EXPOSE 10000

# Script de inicialização
ENTRYPOINT ["./entrypoint.sh"]

# Inicia a aplicação
CMD ["node", "dist/server.js"]

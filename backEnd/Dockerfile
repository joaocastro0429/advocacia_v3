# Usa Node moderno
FROM node:22

# Diretório de trabalho
WORKDIR /app

# Copia dependências primeiro (melhora cache do build)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia restante do projeto
COPY . .

# Gera cliente Prisma para ambiente Linux
RUN npx prisma generate

# Compila o projeto (se for TypeScript)
RUN npm run build

# Copia script de entrada
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Porta usada pelo Render
EXPOSE 10000

# Executa script que roda migrations
ENTRYPOINT ["./entrypoint.sh"]

# Inicia aplicação
CMD ["node", "dist/index.js"]


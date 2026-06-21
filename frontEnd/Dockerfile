# c:\Users\Santri\Documents\Estudo Dev\advocacia_v3-main\frontEnd\Dockerfile

# Estágio 1: Build da aplicação React
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Define a URL da API. 
# IMPORTANTE: Se for rodar em um servidor real, troque 'localhost' pelo IP/Domínio do servidor.
# O navegador do usuário precisa acessar essa URL.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Estágio 2: Servir com Nginx
FROM nginx:alpine

# Instala envsubst (gettext) para substituir variáveis de ambiente em tempo de
# execução e copia arquivos necessários
RUN apk add --no-cache gettext

# Copia os arquivos gerados no build para a pasta do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o template e o entrypoint que fará a substituição em tempo de execução
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

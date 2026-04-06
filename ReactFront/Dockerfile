FROM node:18-alpine

WORKDIR /app

# Instalar dependencias solo package.json para cache
COPY package*.json ./

RUN npm install

# Copiar el resto de archivos
COPY . .

# Puerto donde corre React
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]

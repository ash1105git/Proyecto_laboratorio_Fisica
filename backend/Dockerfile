# backend/Dockerfile
FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto
EXPOSE 4000

# Comando de inicio
CMD ["npm", "run", "dev"]

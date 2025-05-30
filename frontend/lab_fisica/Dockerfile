FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias (recompilar módulos nativos si aplica)
RUN npm install --force

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto de desarrollo de Vite
EXPOSE 5173

# Ejecutar Vite en modo dev
CMD ["npm", "run", "dev", "--", "--host"]



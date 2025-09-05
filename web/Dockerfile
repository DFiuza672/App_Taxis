FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Build é opcional para dev, mas bom para consistência
RUN npm run build

# O comando de start é dado no docker-compose.yml
EXPOSE 3000
CMD ["npm", "run", "dev"]
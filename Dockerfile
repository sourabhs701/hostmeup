FROM node:24.2.0
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy source code and public files
COPY src/ ./src/
COPY public/ ./public//
COPY .env .env

EXPOSE 3000
CMD ["npm", "start"] 
FROM node:24.2.0

WORKDIR /app

COPY . .
RUN npm install

CMD ["npm", "start"] 
FROM node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .

CMD ["npm", "start"] 


# docker run -d \
#   -v /home/app/hostmeup/data:/app/data \
#   -v /home/app/hostmeup/logs:/app/logs \
#   -p 3000:3000 \
#   --env-file .env \
#   --restart=always \
#   hostmeup

# sudo systemctl enable docker

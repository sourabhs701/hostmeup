FROM node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY . .

CMD ["npm", "start"] 


# docker run -d \
#   -v /home/hostmeup/data:/app/data \
#   -v /home/hostmeup/logs:/app/logs \
#   -p 3000:3000 \
#   --env-file .env \
#   --restart=unless-stopped \
#   hostmeup

# sudo systemctl enable docker

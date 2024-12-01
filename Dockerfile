# ใช้ Node.js เป็น base image
FROM node:18

RUN mkdir -p /usr/src/frontend

WORKDIR /usr/src/frontend

RUN apt-get update && \
  apt-get install -y vim && \
  rm -rf /var/lib/apt/lists/*

COPY package*.json ./


RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]

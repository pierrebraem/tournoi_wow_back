FROM node:26-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY ./ /app

CMD ["npx", "nodemon", "--legacy-watch", "index.js"]
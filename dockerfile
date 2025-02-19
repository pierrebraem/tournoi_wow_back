FROM node:22.13.1

WORKDIR /app

COPY package.json /app

RUN npm install

COPY ./ /app

CMD ["npx", "nodemon", "--legacy-watch", "index.js"]
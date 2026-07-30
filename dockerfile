FROM node:26-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --include=dev

ENV NODE_ENV=development

COPY ./ /app

CMD ["npm", "run", "dev"]
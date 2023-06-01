FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.production .env


RUN npm run build

ENV NODE_ENV production
EXPOSE 3000

CMD [ "node", "dist/app.js" ]
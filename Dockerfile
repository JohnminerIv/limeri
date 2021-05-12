FROM node:14

WORKDIR /usr/src/app

COPY ./src/package*.json ./

RUN npm install

COPY ./src .

EXPOSE ${PORT}

CMD [ "node", "index.js" ]
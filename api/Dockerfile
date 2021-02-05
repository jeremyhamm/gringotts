FROM node:latest

RUN mkdir -p /api

WORKDIR /api

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
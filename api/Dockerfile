FROM node:latest
RUN apt-get update && \
  mkdir -p /api
WORKDIR /api
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
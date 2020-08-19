FROM node:10-alpine
ENV PORT 80
WORKDIR /usr/src/app
COPY . /usr/src/app

#RUN npm install -g nodemon
RUN npm install

#ENTRYPOINT ["nodemon", "/usr/src/app/server.js"]

ENTRYPOINT ["node", "/usr/src/app/server.js"]

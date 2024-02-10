FROM node:current-alpine3.18
RUN mkdir -p /polycord
WORKDIR /polycord
COPY package.json /polycord
RUN npm install --only-production && npm cache clean --force

## following 3 lines are for installing ffmepg
RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY . /polycord

CMD node index.js

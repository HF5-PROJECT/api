FROM node:19 AS base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

FROM base AS prod
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
ENV HOST 0.0.0.0
CMD [ "npm", "run", "start" ]

FROM base AS dev
CMD [ "npm", "run", "dev" ]
FROM node:20

WORKDIR /usr/src/app

COPY ./src .
COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "run", "start:dev"]
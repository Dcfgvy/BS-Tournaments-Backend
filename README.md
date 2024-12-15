<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

TypeScript BS Tournaments app
<!--[Nest](https://github.com/nestjs/nest)-->

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Seeding the database

```bash
# execute all seeders
$ yarn seed

# execute seeders for specified tables
$ yarn seed users brawlers

# seed production or test database (on server)
$ docker exec -it { backend_container_name } sh
$ node /usr/src/app/dist/database/seed.js events brawlers payment_methods withdrawal_methods
$ exit
```

## Migrations

```bash
# generate a migration
$ npx ts-node-esm -r tsconfig-paths/register node_modules/typeorm/cli.js migration:generate ./src/database/migrations/{MIGRATION_NAME} -d ./src/database/data-source.ts

# revert last executed migration
$ npx ts-node-esm -r tsconfig-paths/register node_modules/typeorm/cli.js migration:revert -d ./src/database/data-source.ts
```
## Description

The project acts like a crypto wallet service with user authentication.

It has different modules separated by business logic.

The kyc module has the veriff integration logic, which is used to verify the age of a user. Based on the age, a user is allowed to login to the platform.

The app has also been deployed to aws apprunner. This is the url: https://tpibaq33xi.eu-west-1.awsapprunner.com/. The routes can be checked using this url in some API client like postman.

The environment variables can be provided on request. Here are the list of environment variables:
MONGO_PASSWORD
MONGO_USER
JWT_SECRET
JWT_EXPIRATION
VERIFF_API_PRIVATE_KEY
VERIFF_API_PUBLIC_KEY
APP_URL


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


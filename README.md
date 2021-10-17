## Description

 // Flow
    // First we signup with email and password
    // User will verify email
    // Kyc inputs for verification (validate the inputs)
    // User goes to veriff url
    // User does whatever verification inside veriff
    // Veriff uses callback url to send user back to our app
    // Now we check decision for login (pass is login to wallet, fail is 401 error)

    // save session id, and session token, status

    // create update balance for user

    // 2 routes for wallet:
    //  1 is to check balance, getRoute 1 param: userId, network, accessToken
    //  2 is to import wallet from some external api, postRoute, body: accessToken, exchange

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


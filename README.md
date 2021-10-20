## Description

The project acts like a crypto wallet service with user authentication.

It has different modules separated by business logic.

The kyc module has the veriff integration logic, which is used to verify the age of a user. Based on the age, a user is allowed to login to the platform.

The app has also been deployed to aws apprunner. This is the url: https://tpibaq33xi.eu-west-1.awsapprunner.com/. The routes can be checked using this url in some API client like postman.

This is the flow for testing the api (note that the post request body requirement can be seen by dto and filled accordingly):
1. POST request to: https://tpibaq33xi.eu-west-1.awsapprunner.com/user
2. Take the 'verification' item from the previous response or database and use that to verify email with GET request: https://tpibaq33xi.eu-west-1.awsapprunner.com/user/verify-email/:verification
3. Now your email is verified and you can start kyc process, make POST request to https://tpibaq33xi.eu-west-1.awsapprunner.com/kyc
4. You will be redirected to veriff for submitting documents and after that you can try to login with POST request: https://tpibaq33xi.eu-west-1.awsapprunner.com/user/login
5. Depending on verification status you will get login response. If you can successfully login, then you can use the 'accessToken' in the header as Authorization to visit protected routes 
6. Now the protected wallet routes can be checked. Wallet needs to be imported first with POST request: https://tpibaq33xi.eu-west-1.awsapprunner.com/wallet/import
7. In the end the wallet balance can be checked by GET request: https://tpibaq33xi.eu-west-1.awsapprunner.com/wallet/:userId

The environment variables can be provided on request (but will not be needed to test in this case). Here are the list of environment variables:
- MONGO_PASSWORD
- MONGO_USER
- JWT_SECRET
- VERIFF_API_PRIVATE_KEY
- VERIFF_API_PUBLIC_KEY
- APP_URL


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


// This is not for real life scenario, it is just to make testing easier so that you do not need to make .env file
export const ENVIRONMENT = {
  JWT_SECRET: process.env.JWT_SECRET || 'neverGonnaGiveYouUp',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'PwPmhwmrD8R8fROC',
  MONGO_USER: process.env.MONGO_USER || 'admin',
  VERIFF_API_PRIVATE_KEY:
    process.env.VERIFF_API_PRIVATE_KEY ||
    '1ac85373-fb15-4816-a509-f823f7108c5f',
  VERIFF_API_PUBLIC_KEY:
    process.env.VERIFF_API_PUBLIC_KEY || '16c1d795-3bcc-4746-87b0-e6379328601f',
  APP_URL:
    process.env.APP_URL || 'https://tpibaq33xi.eu-west-1.awsapprunner.com',
};

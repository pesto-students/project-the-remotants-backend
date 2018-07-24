import dotenv from 'dotenv';

dotenv.config();

const {
  DB_URL,
  DB_NAME,
  USERS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  TEST_DB_URL,
  TEST_DB_NAME,
  TEST_USERS_COLLECTION,
  TEST_ORGANISATIONS_COLLECTION,
  SECRET,
  SALT_ROUNDS,
} = process.env;

const PORT = process.env.PORT || 8000;

const URLS = {
  FRONTEND_URL: 'http://localhost:8080',
};

const env = process.env.NODE_ENV;
if ((env === 'production') || (env === 'staging')) {
  URLS.FRONTEND_URL = 'https://the-remotants.netlify.com';
}

const errorStatusCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
};

export const productionConstants = {
  DB_URL,
  DB_NAME,
  USERS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  SECRET,
  SALT_ROUNDS,
  ONE_DAY: 7 * 24 * 60 * 60,
  ONE_HOUR: 60 * 60,
  PORT,
  URLS,
  ERROR_CODES: errorStatusCodes,
};

export const testConstants = {
  TEST_DB_URL,
  TEST_DB_NAME,
  TEST_USERS_COLLECTION,
  TEST_ORGANISATIONS_COLLECTION,
};


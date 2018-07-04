import dotenv from 'dotenv';

dotenv.config();

const {
  DB_URL,
  DB_NAME,
  USERS_COLLECTION,
  TEST_DB_URL,
  TEST_DB_NAME,
  TEST_USERS_COLLECTION,
  SECRET,
  SALT_ROUNDS,
} = process.env;


const PORT = process.env.PORT || 8000;

export const productionConstants = {
  DB_URL,
  DB_NAME,
  USERS_COLLECTION,
  SECRET,
  SALT_ROUNDS,
  ONE_DAY: 7 * 24 * 60 * 60,
  PORT,
};

export const testConstants = {
  TEST_DB_URL,
  TEST_DB_NAME,
  TEST_USERS_COLLECTION,
};


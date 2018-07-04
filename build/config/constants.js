'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testConstants = exports.productionConstants = undefined;

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var _process$env = process.env,
    DB_URL = _process$env.DB_URL,
    DB_NAME = _process$env.DB_NAME,
    USERS_COLLECTION = _process$env.USERS_COLLECTION,
    TEST_DB_URL = _process$env.TEST_DB_URL,
    TEST_DB_NAME = _process$env.TEST_DB_NAME,
    TEST_USERS_COLLECTION = _process$env.TEST_USERS_COLLECTION,
    SECRET = _process$env.SECRET,
    SALT_ROUNDS = _process$env.SALT_ROUNDS;


var PORT = process.env.PORT || 8000;

var productionConstants = exports.productionConstants = {
  DB_URL: DB_URL,
  DB_NAME: DB_NAME,
  USERS_COLLECTION: USERS_COLLECTION,
  SECRET: SECRET,
  SALT_ROUNDS: SALT_ROUNDS,
  ONE_DAY: 7 * 24 * 60 * 60,
  PORT: PORT
};

var testConstants = exports.testConstants = {
  TEST_DB_URL: TEST_DB_URL,
  TEST_DB_NAME: TEST_DB_NAME,
  TEST_USERS_COLLECTION: TEST_USERS_COLLECTION
};
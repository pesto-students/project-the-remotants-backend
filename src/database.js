import { MongoClient } from 'mongodb';

import { productionConstants } from './config/constants';

const MONGO_URL = productionConstants.DB_URL;
const { DB_NAME } = productionConstants;

let connectionInstance;

const getDbClient = async () => {
  if (connectionInstance === undefined) {
    connectionInstance = await MongoClient.connect(MONGO_URL, { useNewUrlParser: true });
  }
  return connectionInstance;
};

const getDb = async () => {
  await getDbClient();

  if (connectionInstance === undefined) {
    throw new Error('No connection instance present');
  }
  return connectionInstance.db(DB_NAME);
};

export {
  getDbClient,
  getDb,
};

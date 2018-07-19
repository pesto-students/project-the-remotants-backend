import jwt from 'jsonwebtoken';

import { getDb } from '../database';
import { productionConstants } from '../config/constants';
import userExists from './userExists';
import createErrorMessage from '../helpers/createErrorMessage';
import createSuccessMessage from '../helpers/createSuccessMessage';


const createToken = (email) => {
  const token = jwt.sign(
    { email },
    productionConstants.SECRET,
    {
      expiresIn:
      Math.floor(new Date().getTime() / 1000) + (+productionConstants.ONE_DAY),
    },
  );
  return token;
};

const verifyToken = async (token) => {
  const res = await jwt.verify(token, productionConstants.SECRET, async (err, decoded) => {
    if (err) {
      return createErrorMessage('Failed to authenticate');
    }
    const { email } = decoded;

    const db = await getDb();
    const collection = 'users';
    try {
      const user = await userExists(db, collection, email);
      if (user === null) {
        return createErrorMessage('No such user');
      }
      return createSuccessMessage('user', user);
    } catch (e) {
      return createErrorMessage('Caught an error while checking if the user exists or not.');
    }
  });
  return res;
};

export {
  createToken,
  verifyToken,
};

import jwt from 'jsonwebtoken';

import { getDb } from '../database';
import { productionConstants } from '../config/constants';
import userExists from './userExists';


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
      return ({
        errors: {
          name: `Failed to authenticate: ${err}`,
        },
      });
    }
    const { email } = decoded;

    const db = await getDb();
    const collection = 'users';
    try {
      const user = await userExists(db, collection, email);
      if (user === null) {
        return ({
          errors: {
            name: 'No such user',
          },
        });
      }
      return {
        success: true,
        user,
      };
    } catch (e) {
      return {
        errors: {
          name: 'Caught an error while checking if the user exists or not.',
        },
      };
    }
  });
  return res;
};

export {
  createToken,
  verifyToken,
};

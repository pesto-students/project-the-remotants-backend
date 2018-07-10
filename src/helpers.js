import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { productionConstants } from './config/constants';
import { getDb } from './database';


const userExists = async (db, collection, email) => {
  try {
    const userArray = await db.collection(collection)
      .find({
        email,
      }).project({
        _id: 0, id: 1, email: 1,
      }).toArray();
    const [user] = userArray;
    if (user === null) {
      return null;
    }
    return user;
  } catch (e) {
    return null;
  }
};

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

const generateHash = async (plainText) => {
  const hash = await bcrypt.hash(plainText, (+productionConstants.SALT_ROUNDS));
  return hash;
};

const compareHash = async (plainText, hash) => {
  const match = await bcrypt.compare(plainText, hash);
  return match;
};

export {
  createToken,
  verifyToken,
  generateHash,
  compareHash,
  userExists,
};

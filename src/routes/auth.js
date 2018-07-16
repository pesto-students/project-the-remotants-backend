import express from 'express';
import shortid from 'shortid';

import { getDb } from '../database';
import { createToken } from '../helpers/handleToken';
import { generateHash, compareHash } from '../helpers/handleHash';
import validations from '../helpers/authValidation';
import { productionConstants } from '../config/constants';


const route = express.Router();

export const addUser = async (db, collection, { id, email, password }) => {
  try {
    const hashedPassword = await generateHash(password);
    await db.collection(collection)
      .insertOne({
        id,
        email,
        password: hashedPassword,
      });

    return {
      success: true,
    };
  } catch (e) {
    return {
      errors: {
        name: '[Register]: Caught an error while adding user to the Database.',
      },
    };
  }
};

export const registerUser = async (db, collection, { id, email, password }) => {
  try {
    const found = await db.collection(collection).count({ email });
    if (found === 0) {
      return await addUser(db, collection, { id, email, password });
    }
    return {
      errors: {
        name: 'User exists',
      },
    };
  } catch (e) {
    return {
      errors: {
        name: '[Register]: Caught an error while registering user.',
      },
    };
  }
};

export const loginUser = async (db, collection, { email, password }) => {
  try {
    const user = await db.collection(collection)
      .findOne({ email });

    if (user === null) {
      return {
        errors: {
          name: 'Email entered is incorrect',
        },
      };
    }
    const hashedPassword = user.password;
    const match = await compareHash(password, hashedPassword);

    if (match === false) {
      return {
        errors: {
          name: 'Password entered is incorrect',
        },
      };
    }

    const token = createToken(user.email);
    return {
      success: true,
      token,
    };
  } catch (e) {
    return {
      errors: {
        name: '[Login]: Caught an error while getting user from the database.',
      },
    };
  }
};


route.post('/register', async (req, res) => {
  const db = await getDb();
  const collection = productionConstants.USERS_COLLECTION;
  const formData = req.body;

  const { errors, isValid } = validations.validateInput(formData);
  if (!isValid) {
    res.json({ errors });
  } else {
    const id = shortid.generate().toLowerCase();
    const response = await registerUser(db, collection, { ...formData, id });
    res.json(response);
  }
});

route.post('/login', async (req, res) => {
  const db = await getDb();
  const collection = productionConstants.USERS_COLLECTION;

  const formData = req.body;
  const { errors, isValid } = validations.validateInput(formData);
  if (!isValid) {
    res.json({ errors });
  } else {
    const response = await loginUser(db, collection, formData);
    res.json(response);
  }
});

export default route;

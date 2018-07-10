import express from 'express';

import authenticate from '../middlewares/authenticate';
import { getDb } from '../database';
import { productionConstants } from '../config/constants';
import usernameExists from '../helpers/usernameExists';

const route = express.Router();

route.use(authenticate);

export const updateUser = async (db, collection, email, dataToBeUpdated) => {
  const { name, dob, username } = dataToBeUpdated;

  const response = await usernameExists(db, collection, username);
  if (response.success !== true) {
    return response;
  }

  try {
    await db.collection(collection).update(
      { email },
      {
        $set: {
          name,
          dob,
          username,
        },
      },
    );
    return {
      success: true,
    };
  } catch (e) {
    return {
      errors: {
        name: '[Register]: Caught an error while updating user details.',
      },
    };
  }
};

route.get('/', (req, res) => {
  res.json({ success: true });
});

// For setting up the user details
route.post('/setup', async (req, res) => {
  /*
  * name: string
  * dob: dob
  * username: string
  */
  const { currentUser } = req;
  const db = await getDb();
  const collection = productionConstants.USERS_COLLECTION;
  // update user details
  const response = await updateUser(db, collection, currentUser, req.body);
  res.json(response);
});

export default route;

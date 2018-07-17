import express from 'express';

import { getDb } from '../../database';
import { productionConstants } from '../../config/constants';
import usernameExists from '../../helpers/usernameExists';
import routes from '../../config/routes';


const route = express.Router();

export const updateUser = async (db, collection, email, dataToBeUpdated) => {
  const { name, username } = dataToBeUpdated;

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
        name: '[Update]: Caught an error while updating user details.',
      },
    };
  }
};

// For setting up the user details
route.post(routes.Home, async (req, res) => {
  /*
  * name: string
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

import express from 'express';

import { getDb } from '../../database';
import { productionConstants } from '../../config/constants';
import { userRoutes } from '../../config/routes';


const route = express.Router();

export const getUser = async (db, collection, id) => {
  try {
    const userArray = await db.collection(collection).find({
      id,
    }).project({
      _id: 0, username: 1, name: 1,
    }).toArray();
    const [user] = userArray;
    if (user === undefined) {
      return null;
    }
    return user;
  } catch (e) {
    return {
      error: {
        name: 'Error finding user',
      },
    };
  }
};

route.get(userRoutes.Get, async (req, res) => {
  const db = await getDb();
  const collection = productionConstants.USERS_COLLECTION;
  const userID = req.params.id;
  const user = await getUser(db, collection, userID);
  if (user === null) {
    res.json({
      error: {
        name: 'This user does not exist',
      },
    });
  } else {
    res.json(user);
  }
});


export default route;

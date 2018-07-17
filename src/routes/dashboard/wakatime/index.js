import express from 'express';
import axios from 'axios';

import { wakatimeRoutes, wakatimeApiRoutes } from '../../../config/routes';
import { getDb } from '../../../database';
import { productionConstants } from '../../../config/constants';


const route = express.Router();

/* project
  * 1. current user projects
  * 2. all projects of users in a team
*/

const getAccessTokenFromEmail = async (db, collection, email) => {
  try {
    const userArray = await db.collection(collection)
      .find({
        email,
      }).project({
        _id: 0, 'wakatime.access_token': 1,
      }).toArray();
    const [user] = userArray;
    const token = user.wakatime.access_token;
    if (token === undefined) {
      return {
        errors: {
          name: 'You need to connect your wakatime account!',
        },
      };
    }
    return {
      success: true,
      token,
    };
  } catch (e) {
    return {
      errors: {
        name: 'Caught an error while getting details from Mongo',
      },
    };
  }
};

route.get(wakatimeRoutes.Projects, async (req, res) => {
  // get the token
  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  // get the access token
  const { success, token, errors } = await getAccessTokenFromEmail(db, userCollection, currentUser);
  let response;
  if (success === true) {
    const axiosConfig = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const axiosResponse = await axios(wakatimeApiRoutes.Projects, axiosConfig);
      response = axiosResponse.data;
    } catch (e) {
      response = {
        errors: {
          name: 'Caught an error while making API request to WakaTime',
        },
      };
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});

export default route;


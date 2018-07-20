import express from 'express';
import axios from 'axios';

import { wakatimeRoutes, wakatimeApiRoutes } from '../../../config/routes';
import { getDb } from '../../../database';
import { productionConstants } from '../../../config/constants';
import createErrorMessage from '../../../helpers/createErrorMessage';
import createSuccessMessage from '../../../helpers/createSuccessMessage';


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
      return createErrorMessage('You need to connect your wakatime account!');
    }
    return createSuccessMessage('token', token);
  } catch (e) {
    return createErrorMessage('Caught an error while getting details from Mongo');
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
      const { data } = axiosResponse;
      response = createSuccessMessage('data', data);
    } catch (e) {
      response = createErrorMessage('Caught an error while making API request to WakaTime');
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});

route.get(wakatimeRoutes.ProjectCommits, async (req, res) => {
  // get the token
  const projectID = req.params.project;
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
      const axiosResponse = await axios(`${wakatimeApiRoutes.Projects}/${projectID}/commits`, axiosConfig);
      const { data } = axiosResponse;
      response = createSuccessMessage('data', data);
    } catch (e) {
      if (e.response.status === 403) {
        response = createErrorMessage('You don\'t have permissions to access this section!');
      } else {
        response = createErrorMessage('Caught an error while making API request to WakaTime');
      }
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});


export default route;


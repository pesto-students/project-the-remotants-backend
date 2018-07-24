import express from 'express';
import axios from 'axios';

import { githubRoutes, githubApiRoutes } from '../../../config/routes';
import { getDb } from '../../../database';
import { productionConstants } from '../../../config/constants';
import createSuccessMessage from '../../../helpers/createSuccessMessage';
import createErrorMessage from '../../../helpers/createErrorMessage';


const route = express.Router();

const getAccessTokenFromEmail = async (db, collection, email) => {
  try {
    const userArray = await db.collection(collection)
      .find({
        email,
      }).project({
        _id: 0, 'github.access_token': 1,
      }).toArray();
    const [user] = userArray;
    const token = user.github.access_token;
    if (token === undefined) {
      return createErrorMessage('You need to connect your github account!');
    }
    return createSuccessMessage('token', token);
  } catch (e) {
    return createErrorMessage('Caught an error while getting details from Mongo');
  }
};
// /dashboard/api/github
route.get(githubRoutes.Issues, async (req, res) => {
  // get the token
  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

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
      const axiosResponse = await axios(githubApiRoutes.Issues, axiosConfig);
      response = createSuccessMessage('data', axiosResponse.data);
    } catch (e) {
      response = createErrorMessage('Caught an error while making request to Github');
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});

route.get(githubRoutes.Repos, async (req, res) => {
  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

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
      const axiosResponse = await axios(githubApiRoutes.Repos, axiosConfig);
      response = createSuccessMessage('data', axiosResponse.data);
    } catch (e) {
      response = createErrorMessage('Caught an error while making request to Github');
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});

route.get(githubRoutes.RepoPullRequests, async (req, res) => {
  const repoName = req.params.repo;
  const ownerName = req.params.owner;
  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

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
      const axiosResponse = await axios(`${githubApiRoutes.RepoPullRequests}/${ownerName}/${repoName}/pulls`, axiosConfig);
      const { data } = axiosResponse;
      response = createSuccessMessage('data', data);
    } catch (e) {
      if (e.response.status === 403) {
        response = createErrorMessage('You don\'t have permissions to access this section');
      } else {
        response = createErrorMessage('Caught an error while fetching data from GitHub');
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

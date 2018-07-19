import express from 'express';
import https from 'https';
import qs from 'querystring';

import { getDb } from '../../database';
import { productionConstants } from '../../config/constants';
import { authRoutes } from '../../config/routes';
import config from '../../config/authConfig';
import createErrorMessage from '../../helpers/createErrorMessage';
import createSuccessMessage from '../../helpers/createSuccessMessage';


const route = express.Router();

const storeAuthDetails = async (db, collection, currentUser, authType, data) => {
  try {
    await db.collection(collection).update(
      { email: currentUser },
      {
        $set: {
          [authType]: data,
        },
      },
    );
    return createSuccessMessage();
  } catch (e) {
    return createErrorMessage('Caught an error at the time of storing auth details');
  }
};

const requestSetup = (authProvider, code) => {
  let data;
  let reqOptions;
  if (authProvider === 'github') {
    data = qs.stringify({
      client_id: config.OAUTH_GITHUB_CLIENT_ID,
      client_secret: config.OAUTH_GITHUB_CLIENT_SECRET,
      redirect_uri: config.OAUTH_GITHUB_REDIRECT_URI,
      code,
    });
    reqOptions = {
      host: config.OAUTH_GITHUB_HOST,
      port: config.OAUTH_PORT,
      path: config.OAUTH_GITHUB_PATH,
      method: config.OAUTH_METHOD,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'content-length': data.length,
      },
    };
  } else if (authProvider === 'wakatime') {
    data = qs.stringify({
      client_id: config.OAUTH_WAKATIME_CLIENT_ID,
      client_secret: config.OAUTH_WAKATIME_CLIENT_SECRET,
      redirect_uri: config.OAUTH_WAKATIME_REDIRECT_URI,
      grant_type: 'authorization_code',
      code,
    });
    reqOptions = {
      host: config.OAUTH_WAKATIME_HOST,
      port: config.OAUTH_PORT,
      path: config.OAUTH_WAKATIME_PATH,
      method: config.OAUTH_METHOD,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'content-length': data.length,
      },
    };
  }
  return { data, reqOptions };
};

const authenticate = (authProvider, code, cb) => {
  // get the data and reqOptions
  const { data, reqOptions } = requestSetup(authProvider, code);

  let body = '';
  const req = https.request(reqOptions, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      cb(null, qs.parse(body));
    });
  });

  req.write(data);
  req.end();
  req.on('error', (e) => { cb(e.message); });
};

// Convenience for allowing CORS on routes - GET, POST and OPTIONS only
route.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

route.get(authRoutes.GitHub, (req, res) => {
  authenticate('github', req.params.code, async (error, data) => {
    const response = {};
    if (error !== null) {
      response.errors = {
        name: error,
      };
    } else {
      const result = data;
      response.token = result.access_token;

      // store the result in mongo for the current user
      const { currentUser } = req;
      const db = await getDb();
      const collection = productionConstants.USERS_COLLECTION;

      const { success, errors } = await storeAuthDetails(db, collection, currentUser, 'github', result);
      if (success === true) {
        response.success = success;
      } else {
        response.errors = errors;
      }
    }
    res.json(response);
  });
});

route.get(authRoutes.WakaTime, (req, res) => {
  authenticate('wakatime', req.params.code, async (error, data) => {
    const response = {};
    if (error !== null) {
      response.errors = {
        name: error,
      };
    } else {
      let [result] = Object.keys(data);
      result = JSON.parse(result);
      response.token = result.access_token;

      const { currentUser } = req;
      const db = await getDb();
      const collection = productionConstants.USERS_COLLECTION;

      const { success, errors } = await storeAuthDetails(db, collection, currentUser, 'wakatime', result);
      if (success === true) {
        response.success = success;
      } else {
        response.errors = errors;
      }
    }
    res.json(response);
  });
});

export default route;


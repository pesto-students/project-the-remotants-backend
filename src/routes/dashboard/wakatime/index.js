import express from 'express';
import axios from 'axios';

import { wakatimeRoutes, wakatimeApiRoutes } from '../../../config/routes';
import { getDb } from '../../../database';
import { productionConstants } from '../../../config/constants';
import createErrorMessage from '../../../helpers/createErrorMessage';
import createSuccessMessage from '../../../helpers/createSuccessMessage';
import wakatimeErrorHandler from '../../../helpers/wakatimeErrorHandler';
import getWakaTimeTokenFromID from '../../../helpers/getWakaTimeTokenFromID';

const route = express.Router();

const connectToWakaTimeErrorMessage = 'You need to connect your WakaTime account!';

export const getWakaTimeTokenFromEmail = async (db, collection, email) => {
  try {
    const userArray = await db.collection(collection)
      .find({
        email,
      }).project({
        _id: 0, 'wakatime.access_token': 1,
      }).toArray();
    const [user] = userArray;
    if (user.wakatime === undefined) {
      return createErrorMessage(connectToWakaTimeErrorMessage);
    }
    const token = user.wakatime.access_token;
    if (token === undefined) {
      return createErrorMessage(connectToWakaTimeErrorMessage);
    }
    return createSuccessMessage('token', token);
  } catch (e) {
    if (e.response === undefined) {
      return createErrorMessage('Caught an error while making API request to WakaTime');
    }
    return wakatimeErrorHandler(e);
  }
};

const getProjects = async (token) => {
  const axiosConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const axiosResponse = await axios(wakatimeApiRoutes.Projects, axiosConfig);
    const { data } = axiosResponse.data;
    return createSuccessMessage('data', data);
  } catch (e) {
    if (e.response === undefined) {
      return createErrorMessage('Caught an error while making API request to WakaTime');
    }
    return wakatimeErrorHandler(e);
  }
};

const getProjectCommits = async (token, projectID) => {
  const axiosConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const axiosResponse = await axios(`${wakatimeApiRoutes.Projects}/${projectID}/commits`, axiosConfig);
    const { data } = axiosResponse;
    return createSuccessMessage('data', data);
  } catch (e) {
    if (e.response === undefined) {
      return createErrorMessage('Caught an error while making API request to WakaTime');
    }
    return wakatimeErrorHandler(e);
  }
};

const getAggregatedDurations = (data) => {
  const aggregator = new Map();
  data.forEach((item) => {
    const itemDuration = aggregator.get(item.project);
    if (itemDuration === undefined) {
      aggregator.set(item.project, item.duration);
    } else {
      aggregator.set(item.project, itemDuration + item.duration);
    }
  });

  const aggregatedData = [];

  aggregator.forEach((duration, project) => {
    aggregatedData.push({
      name: project,
      total_seconds: duration,
    });
  });

  return aggregatedData;
};

const getDurations = async (token, date) => {
  const axiosConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const axiosResponse = await axios(`${wakatimeApiRoutes.Durations}?date=${date}`, axiosConfig);
    const { data } = axiosResponse.data;

    const aggregatedDurations = getAggregatedDurations(data);

    return createSuccessMessage('data', aggregatedDurations);
  } catch (e) {
    if (e.response === undefined) {
      return createErrorMessage('Caught an error while making API request to WakaTime');
    }
    return wakatimeErrorHandler(e);
  }
};

const getUserDetails = async (token) => {
  const axiosConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const axiosResponse = await axios(wakatimeApiRoutes.UserDetails, axiosConfig);
    const { data } = axiosResponse.data;
    return createSuccessMessage('data', data);
  } catch (e) {
    if (e.response === undefined) {
      return createErrorMessage('Caught an error while making API request to WakaTime');
    }
    return wakatimeErrorHandler(e);
  }
};

const getStats = async (token, dateRange) => {
  const axiosConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const axiosResponse = await axios(`${wakatimeApiRoutes.Stats}/${dateRange}`, axiosConfig);
    const { data } = axiosResponse.data;
    return createSuccessMessage('data', data);
  } catch (e) {
    if (e.response === undefined) {
      return createErrorMessage('Caught an error while making API request to WakaTime');
    }
    return wakatimeErrorHandler(e);
  }
};

const getSummaries = async (token, { start, end }) => {
  const axiosConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const axiosResponse = await axios(`${wakatimeApiRoutes.Summaries}?start=${start}&end=${end}`, axiosConfig);
    const { data } = axiosResponse.data;
    return createSuccessMessage('data', data);
  } catch (e) {
    if (e.response === undefined) {
      return createErrorMessage('Caught an error while making API request to WakaTime');
    }
    return wakatimeErrorHandler(e);
  }
};


route.get(wakatimeRoutes.Projects, async (req, res) => {
  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  const {
    success,
    token,
    errors,
  } = await getWakaTimeTokenFromEmail(db, userCollection, currentUser);
  let response;
  if (success === true) {
    const getProjectsResponse = await getProjects(token);
    if (getProjectsResponse.success !== true) {
      response = {
        errors: getProjectsResponse.errors,
      };
    } else {
      response = getProjectsResponse;
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

  const {
    success,
    token,
    errors,
  } = await getWakaTimeTokenFromEmail(db, userCollection, currentUser);
  let response;
  if (success === true) {
    const getProjectCommitsResponse = await getProjectCommits(token, projectID);
    if (getProjectCommitsResponse.success !== true) {
      response = {
        errors: getProjectCommitsResponse.errors,
      };
    } else {
      response = getProjectCommitsResponse;
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});


route.get(wakatimeRoutes.Durations, async (req, res) => {
  const { date } = req.query;

  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  const {
    success,
    token,
    errors,
  } = await getWakaTimeTokenFromEmail(db, userCollection, currentUser);
  let response;
  if (success === true) {
    const getDurationsResponse = await getDurations(token, date);
    if (getDurationsResponse.success !== true) {
      response = {
        errors: getDurationsResponse.errors,
      };
    } else {
      response = getDurationsResponse;
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});


route.get(wakatimeRoutes.DateRangeDurations, async (req, res) => {
  const { start, end } = req.query;

  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  const {
    success,
    token,
    errors,
  } = await getWakaTimeTokenFromEmail(db, userCollection, currentUser);
  let response;
  if (success === true) {
    const getSummariesResponse = await getSummaries(token, { start, end });
    if (getSummariesResponse.success !== true) {
      response = {
        errors: getSummariesResponse.errors,
      };
    } else {
      response = getSummariesResponse;
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});

route.get(wakatimeRoutes.Stats, async (req, res) => {
  const { dateRange } = req.params;

  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  const {
    success,
    token,
    errors,
  } = await getWakaTimeTokenFromEmail(db, userCollection, currentUser);
  let response;
  if (success === true) {
    const getStatsResponse = await getStats(token, dateRange);
    if (getStatsResponse.success !== true) {
      response = {
        errors: getStatsResponse.errors,
      };
    } else {
      response = getStatsResponse;
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});

route.get(wakatimeRoutes.Summaries, async (req, res) => {
  const { start, end } = req.query;

  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  const {
    success,
    token,
    errors,
  } = await getWakaTimeTokenFromEmail(db, userCollection, currentUser);
  let response;
  if (success === true) {
    const getSummariesResponse = await getSummaries(token, { start, end });
    if (getSummariesResponse.success !== true) {
      response = {
        errors: getSummariesResponse.errors,
      };
    } else {
      response = getSummariesResponse;
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});


route.get(wakatimeRoutes.UserDetails, async (req, res) => {
  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  const {
    success,
    token,
    errors,
  } = await getWakaTimeTokenFromEmail(db, userCollection, currentUser);

  let response;
  if (success === true) {
    const getUserDetailsResponse = await getUserDetails(token);
    if (getUserDetailsResponse.success !== true) {
      response = {
        errors: getUserDetailsResponse.errors,
      };
    } else {
      response = getUserDetailsResponse;
    }
  } else {
    response = {
      errors,
    };
  }
  res.json(response);
});


route.get(wakatimeRoutes.OrganisationMemberStats, async (req, res) => {
  const { userID } = req.params;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  const {
    success,
    token,
    errors,
  } = await getWakaTimeTokenFromID(db, userCollection, userID);
  if (success !== true) {
    res.json({ errors });
    return;
  }

  let response;

  const dateRange = 'last_7_days';
  const getStatsResponse = await getStats(token, dateRange);

  if (getStatsResponse.success !== true) {
    response = {
      errors: getStatsResponse.errors,
    };
  } else {
    response = getStatsResponse;
  }

  res.json(response);
});

route.get(wakatimeRoutes.IfTokenExists, async (req, res) => {
  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;

  const response = await getWakaTimeTokenFromEmail(db, userCollection, currentUser);

  if (response.success === true) {
    res.json(createSuccessMessage());
  } else if (response.errors.name === connectToWakaTimeErrorMessage) {
    res.json({ success: false });
  } else {
    res.json({ errors: response.errors });
  }
});


export default route;


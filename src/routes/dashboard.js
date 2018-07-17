import express from 'express';

import authenticate from '../middlewares/authenticate';
import { getDb } from '../database';
import { productionConstants } from '../config/constants';
import usernameExists from '../helpers/usernameExists';
import getUserID from '../helpers/getUserID';
import registerOrganisation from '../helpers/handleOrganisation';
import routes, { dashboardRoutes } from '../config/routes';
import getOwnerID from '../helpers/getOrgOwnerID';

const route = express.Router();

route.use(authenticate);

export const updateUser = async (db, collection, email, dataToBeUpdated) => {
  const { name, username } = dataToBeUpdated;
  try {
    const response = await usernameExists(db, collection, username);
    if (response.success !== true) {
      return response;
    }

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
        name: '[Register]: Caught an error while updating user details.',
      },
    };
  }
};

export const updateOrg = async (db, collection, id, dataToBeUpdated) => {
  const { name, description } = dataToBeUpdated;
  try {
    await db.collection(collection).update(
      { id },
      {
        $set: {
          name,
          description,
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

export const getOrg = async (db, collection, id) => {
  try {
    const organisationArray = await db.collection(collection).find({
      id,
    }).project({
      _id: 0, name: 1, description: 1, ownerID: 1,
    }).toArray();
    const [organisation] = organisationArray;
    if (organisation === undefined) {
      return null;
    }
    return organisation;
  } catch (e) {
    return {
      error: {
        name: 'Error finding organisation',
      },
    };
  }
};

route.get(routes.Home, (req, res) => {
  res.json({ success: true });
});

route.get(dashboardRoutes.GetUser, async (req, res) => {
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

route.get(dashboardRoutes.GetOrganisation, async (req, res) => {
  const db = await getDb();
  const collection = productionConstants.ORGANISATION_COLLECTION;
  const orgID = req.params.id;
  const organisation = await getOrg(db, collection, orgID);
  if (organisation === null) {
    res.json({
      error: {
        name: 'This organisation does not exist',
      },
    });
  } else {
    res.json(organisation);
  }
});

// For setting up the user details
route.post(dashboardRoutes.UserSetup, async (req, res) => {
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

// For setting up the organisation details
route.post(dashboardRoutes.OrganisationSetup, async (req, res) => {
  /*
  * name: string
  * description: string
  * OwnerID: string
  */
  const { currentUser } = req; // gives email id
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;
  const organisationCollection = productionConstants.ORGANISATION_COLLECTION;
  // update user details
  const ownerID = await getUserID(db, userCollection, currentUser);
  if (ownerID === undefined) {
    res.json({
      error: {
        name: 'Could not fetch User ID',
      },
    });
  }
  const response = await registerOrganisation(
    db,
    organisationCollection,
    {
      ...req.body,
      ownerID,
    },
  );
  res.json(response);
});

route.post(dashboardRoutes.OrganisationUpdate, async (req, res) => {
  const organisationID = req.params.id;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;
  const orgCollection = productionConstants.ORGANISATION_COLLECTION;
  const actualOwner = await getOwnerID(db, orgCollection, organisationID);
  const { currentUser } = req;
  const reqOwner = await getUserID(db, userCollection, currentUser);
  if (reqOwner !== actualOwner) {
    res.json({
      errors: {
        name: 'You are not the owner',
      },
    });
  } else {
    const response = await updateOrg(db, orgCollection, organisationID, req.body);
    res.json(response);
  }
});

export default route;

import express from 'express';

import { getDb } from '../../database';
import { productionConstants } from '../../config/constants';
import getUserID from '../../helpers/getUserID';
import registerOrganisation from '../../helpers/handleOrganisation';
import { organisationRoutes } from '../../config/routes';
import getOwnerID from '../../helpers/getOrgOwnerID';
import createErrorMessage from '../../helpers/createErrorMessage';
import createSuccessMessage from '../../helpers/createSuccessMessage';


const route = express.Router();

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
    return createErrorMessage('Error finding organisation');
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
    return createSuccessMessage();
  } catch (e) {
    return createErrorMessage('[Register]: Caught an error while updating organisation details.');
  }
};

route.get(organisationRoutes.Get, async (req, res) => {
  const db = await getDb();
  const collection = productionConstants.ORGANISATIONS_COLLECTION;
  const orgID = req.params.id;
  const organisation = await getOrg(db, collection, orgID);
  if (organisation === null) {
    res.json(createErrorMessage('This organisation does not exist'));
  } else {
    res.json(organisation);
  }
});

route.post(organisationRoutes.Update, async (req, res) => {
  const organisationID = req.params.id;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;
  const orgCollection = productionConstants.ORGANISATIONS_COLLECTION;
  const actualOwner = await getOwnerID(db, orgCollection, organisationID);
  const { currentUser } = req;
  const reqOwner = await getUserID(db, userCollection, currentUser);
  if (reqOwner !== actualOwner) {
    res.json(createErrorMessage('You are not the owner'));
  } else {
    const response = await updateOrg(db, orgCollection, organisationID, req.body);
    res.json(response);
  }
});

// For setting up the organisation details
route.post(organisationRoutes.Setup, async (req, res) => {
  /*
  * name: string
  * description: string
  * ownerID: string
  */
  const { currentUser } = req;
  const db = await getDb();
  const userCollection = productionConstants.USERS_COLLECTION;
  const organisationCollection = productionConstants.ORGANISATIONS_COLLECTION;

  // Update user details
  const ownerID = await getUserID(db, userCollection, currentUser);
  if (ownerID === undefined) {
    res.json(createErrorMessage('Could not fetch User ID'));
  } else {
    const response = await registerOrganisation(
      db,
      organisationCollection,
      {
        ...req.body,
        ownerID,
      },
    );
    res.json(response);
  }
});

export default route;

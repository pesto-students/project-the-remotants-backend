import express from 'express';

import authenticate from '../middlewares/authenticate';
import { getDb } from '../database';
import { productionConstants } from '../config/constants';
import usernameExists from '../helpers/usernameExists';
import getUserID from '../helpers/getUserID';
import registerOrganisation from '../helpers/handleOrganisation';

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

// export const addOrganisation = async (
//   db,
//   usercollection,
//   organisationCollection,
//   email,
//   dataToBeAdded,
// ) => {
//   const ownerID = await getUserID(db, usercollection, email);
//   const { name, description } = dataToBeAdded;
//   dataToBeAdded['ownerID'] = ownerID,
//   try {

//   } catch (e) {
//     return {
//       errors: {
//         name: '[Register Org]: Caught an error while creating the organisation',
//       },
//     };
//   }
// };
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

// For setting up the organisation details
route.post('/orgSetup', async (req, res) => {
  /*
  * name: string
  * description: dob
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
  console.log(ownerID);
  const response = await registerOrganisation(
    db,
    organisationCollection,
    {
      ownerID,
      ...req.body,
    },
  );
  res.json(response);
});

export default route;

import express from 'express';
import shortid from 'shortid';

import { productionConstants } from '../../config/constants';
import { createToken } from '../../helpers/handleToken';
import { generateHash } from '../../helpers/handleHash';
import createSuccessMessage from '../../helpers/createSuccessMessage';
import createErrorMessage from '../../helpers/createErrorMessage';
import { getDb } from '../../database';
import usernameExists from '../../helpers/usernameExists';
import routes from '../../config/routes';


const route = express.Router();

export const joinOrganisation = async (db, organisationsCollection, {
  userID,
  organisation,
  manager,
}) => {
  try {
    if (manager === 0) {
      // employee
      await db.collection(organisationsCollection).update(
        { id: organisation },
        {
          $push: { employee: userID },
        },
      );
    } else {
      // manager
      await db.collection(organisationsCollection).update(
        { id: organisation },
        {
          $push: { manager: userID },
        },
      );
    }

    return createSuccessMessage();
  } catch (e) {
    return createErrorMessage('Caught an error while joining the organisation');
  }
};

export const addUser = async (db, usersCollection, {
  userID,
  email,
  password,
  username,
  name,
}) => {
  try {
    const response = await usernameExists(db, usersCollection, username);
    if (response.success !== true) {
      return response;
    }

    const hashedPassword = await generateHash(password);
    await db.collection(usersCollection)
      .insertOne({
        id: userID,
        email,
        password: hashedPassword,
        username,
        name,
      });

    return createSuccessMessage();
  } catch (e) {
    return createErrorMessage('[Register]: Caught an error while adding/updating user');
  }
};

export const registerInvitedUser = async (db, usersCollection, organisationsCollection, {
  userID,
  email,
  password,
  username,
  name,
  organisation,
  manager,
}) => {
  try {
    const found = await db.collection(usersCollection).count({ email });
    if (found !== 0) {
      try {
        await db.collection(usersCollection).remove({
          email,
        });
      } catch (e) {
        return createErrorMessage('[Register]: Caught an error while registering user.');
      }
    }
    try {
      const { success, errors } = await addUser(db, usersCollection, {
        userID,
        email,
        password,
        username,
        name,
      });

      if (success !== true) {
        return { errors };
      }
    } catch (e) {
      return createErrorMessage('[Register]: Caught an error while adding user to the database');
    }

    try {
      const { success, errors } = await joinOrganisation(db, organisationsCollection, {
        userID,
        organisation,
        manager,
      });

      if (success !== true) {
        return { errors };
      }

      return createSuccessMessage();
    } catch (e) {
      return createErrorMessage('[Register]: Caught an error while adding user to the database');
    }
  } catch (e) {
    return createErrorMessage('[Register]: Caught an error while registering the user to the organisation');
  }
};

route.post(routes.Home, async (req, res) => {
  const db = await getDb();
  const usersCollection = productionConstants.USERS_COLLECTION;
  const organisationsCollection = productionConstants.ORGANISATIONS_COLLECTION;
  const formData = req.body;

  const userID = shortid.generate().toLowerCase();
  const registerResponse = await registerInvitedUser(
    db,
    usersCollection,
    organisationsCollection,
    { ...formData, userID },
  );

  let response;
  if (registerResponse.success === true) {
    const token = createToken(formData.email);
    response = createSuccessMessage('token', token);
  } else {
    response = { errors: registerResponse.errors };
  }
  res.json(response);
});


export default route;

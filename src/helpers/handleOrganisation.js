import shortid from 'shortid';

import createErrorMessage from '../helpers/createErrorMessage';
import createSuccessMessage from '../helpers/createSuccessMessage';
import getUserDetailsFromID from './getUserDetailsFromID';
import { productionConstants } from '../config/constants';
import fetchWakatimeUserDetails from './fetchWakatimeUserDetails';


const addOrganisation = async (db, collection, { name, description, ownerID }) => {
  const id = shortid.generate().toLowerCase();
  try {
    await db.collection(collection)
      .insertOne({
        id,
        name,
        description,
        ownerID,
        employee: [],
        manager: [],
      });

    return createSuccessMessage();
  } catch (e) {
    return createErrorMessage('Caught an error while adding organisation to the Database.');
  }
};

const registerOrganisation = async (db, collection, { name, description, ownerID }) => {
  try {
    const found = await db.collection(collection).count({ name });
    if (found === 0) {
      const organisation = await addOrganisation(db, collection, { name, description, ownerID });
      return organisation;
    }
    return createErrorMessage('Organisation exists');
  } catch (e) {
    return createErrorMessage('Caught an error while registering org.');
  }
};

const getUserDetailsFromResolvedPromise = (arrayOfResolvedPromises) => {
  const arrayOfObjects = [];

  arrayOfResolvedPromises.forEach((promiseResponse) => {
    if (promiseResponse.success === true) {
      const { id, name, email } = promiseResponse.data;
      const tempObj = {
        id,
        name,
        email,
      };
      arrayOfObjects.push(tempObj);
    }
  });

  return arrayOfObjects;
};

const getArrayOfUserDetailsPromise = (db, usersCollection, arrayOfIDs) => {
  const arrayOfPromises = [];
  for (let arrayIndex = 0; arrayIndex < arrayOfIDs.length; arrayIndex += 1) {
    const id = arrayOfIDs[arrayIndex];
    const getManagerDetailsPromise = getUserDetailsFromID(db, usersCollection, id);
    arrayOfPromises.push(getManagerDetailsPromise);
  }
  return arrayOfPromises;
};

const listOrganisations = async (db, collection, ownerID, token) => {
  try {
    const organisationsFromDB = await db.collection(collection).find({
      ownerID,
    }).project({
      _id: 0,
      ownerID: 0,
    }).toArray();

    if (organisationsFromDB.length === 0) {
      return createErrorMessage('This user doesn\'t own any organisation');
    }
    const usersCollection = productionConstants.USERS_COLLECTION;
    const organisations = await Promise.all(organisationsFromDB.map(async (organisation) => {
      const managersID = organisation.manager;
      const managersArrayOfPromises = getArrayOfUserDetailsPromise(db, usersCollection, managersID);

      const managersResolvedPromises = await Promise.all(managersArrayOfPromises);
      const managersArrayOfObjects = getUserDetailsFromResolvedPromise(managersResolvedPromises);


      const employeesID = organisation.employee;
      const employeesArrayOfPromises =
        getArrayOfUserDetailsPromise(db, usersCollection, employeesID);

      const employeesResolvedPromises = await Promise.all(employeesArrayOfPromises);
      const employeesArrayOfObjects = getUserDetailsFromResolvedPromise(employeesResolvedPromises);

      return {
        ...organisation,
        manager: managersArrayOfObjects,
        employee: employeesArrayOfObjects,
      };
    }));

    // get current user image from wakatime
    const { success, data, errors } = await fetchWakatimeUserDetails(token);
    const userDetails = data;
    if (success !== true) {
      return { errors };
    }

    const organisationsWithOwnerWakaTimeDetails = organisations.map(organisation => ({
      ...organisation,
      wakatime: userDetails,
    }));
    return createSuccessMessage('data', organisationsWithOwnerWakaTimeDetails);
  } catch (e) {
    return createErrorMessage('Caught an error while fetching organisations.');
  }
};

const organisationHelper = {
  registerOrganisation,
  listOrganisations,
};

export default organisationHelper;

import shortid from 'shortid';

import createErrorMessage from '../helpers/createErrorMessage';
import createSuccessMessage from '../helpers/createSuccessMessage';
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
    // get current user image from wakatime
    const { success, data, errors } = await fetchWakatimeUserDetails(token);
    const userDetails = data;
    if (success !== true) {
      return { errors };
    }
    const organisations = organisationsFromDB.map(organisation => ({
      ...organisation,
      wakatime: userDetails,
    }));
    return createSuccessMessage('data', organisations);
  } catch (e) {
    return createErrorMessage('Caught an error while fetching organisations.');
  }
};

const organisationHelper = {
  registerOrganisation,
  listOrganisations,
};

export default organisationHelper;

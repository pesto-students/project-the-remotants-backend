import shortid from 'shortid';

import createErrorMessage from '../helpers/createErrorMessage';
import createSuccessMessage from '../helpers/createSuccessMessage';


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

export default registerOrganisation;

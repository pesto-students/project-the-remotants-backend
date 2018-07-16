import shortid from 'shortid';

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

    return {
      success: true,
    };
  } catch (e) {
    return {
      errors: {
        name: '[Register]: Caught an error while adding organisation to the Database.',
      },
    };
  }
};

const registerOrganisation = async (db, collection, { name, description, ownerID }) => {
  try {
    const found = await db.collection(collection).count({ name });
    if (found === 0) {
      return await addOrganisation(db, collection, { name, description, ownerID });
    }
    return {
      errors: {
        name: 'Organisation exists',
      },
    };
  } catch (e) {
    return {
      errors: {
        name: '[Register]: Caught an error while registering org.',
      },
    };
  }
};

export default registerOrganisation;

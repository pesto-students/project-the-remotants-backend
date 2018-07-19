import createErrorMessage from '../helpers/createErrorMessage';
import createSuccessMessage from '../helpers/createSuccessMessage';


const usernameExists = async (db, collection, username) => {
  try {
    const exists = await db.collection(collection)
      .count({
        username,
      });
    if (exists === 0) {
      return createSuccessMessage();
    }
    return createErrorMessage('Username already exists.');
  } catch (e) {
    return createErrorMessage('Caught an error while finding if username exists or not');
  }
};

export default usernameExists;

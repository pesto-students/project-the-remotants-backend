import createErrorMessage from '../helpers/createErrorMessage';
import createSuccessMessage from './createSuccessMessage';

const getUserDetailsFromID = async (db, collection, id) => {
  try {
    const userArray = await db.collection(collection)
      .find({
        id,
      }).project({
        _id: 0,
      }).toArray();
    const [user] = userArray;
    if (user === undefined) {
      return createErrorMessage('No such user exists');
    }
    return createSuccessMessage('data', user);
  } catch (e) {
    return createErrorMessage('Error fetching user');
  }
};

export default getUserDetailsFromID;

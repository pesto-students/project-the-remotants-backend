import createErrorMessage from './createErrorMessage';
import createSuccessMessage from './createSuccessMessage';


const getWakaTimeTokenFromID = async (db, userCollection, id) => {
  try {
    const userArray = await db.collection(userCollection)
      .find({
        id,
      }).project({
        _id: 0,
      }).toArray();
    const [user] = userArray;
    if (user === null || user === undefined) {
      return createErrorMessage('User not found');
    }
    return createSuccessMessage('token', user.wakatime.access_token);
  } catch (e) {
    return createErrorMessage('Error fetching user');
  }
};

export default getWakaTimeTokenFromID;

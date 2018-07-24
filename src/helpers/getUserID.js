import userExists from './userExists';
import createErrorMessage from './createErrorMessage';
import createSuccessMessage from './createSuccessMessage';


const getUserID = async (db, collection, email) => {
  try {
    const user = await userExists(db, collection, email);
    const userID = user.id;
    return createSuccessMessage('userID', userID);
  } catch (e) {
    return createErrorMessage('Error fetching user ID');
  }
};

export default getUserID;

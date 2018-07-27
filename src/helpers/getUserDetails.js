import userExists from './userExists';
import createErrorMessage from './createErrorMessage';
import createSuccessMessage from './createSuccessMessage';


const getUserDetails = async (db, collection, email) => {
  try {
    const user = await userExists(db, collection, email);
    if (user !== null) {
      return createSuccessMessage('user', user);
    }
    return createErrorMessage('This user doesn\'t exist');
  } catch (e) {
    return createErrorMessage('Error fetching user');
  }
};

export default getUserDetails;

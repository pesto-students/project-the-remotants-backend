import userExists from './userExists';

const getUserID = async (db, collection, email) => {
  try {
    const user = await userExists(db, collection, email);
    const userID = user.id;
    return userID;
  } catch (e) {
    return {
      error: {
        name: 'Error fetching user id',
      },
    };
  }
};

export default getUserID;

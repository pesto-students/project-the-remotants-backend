import userExists from './userExists';

const getUserID = async (db, collection, email) => {
  const user = await userExists(db, collection, email);
  const userID = user.id;
  return userID;
};

export default getUserID;

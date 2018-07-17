const userExists = async (db, collection, email) => {
  try {
    const userArray = await db.collection(collection)
      .find({
        email,
      }).project({
        _id: 0, id: 1, email: 1,
      }).toArray();
    const [user] = userArray;
    if (user === undefined) {
      return null;
    }
    return user;
  } catch (e) {
    return {
      error: {
        name: `Error fetching user ${e}`,
      },
    };
  }
};

export default userExists;

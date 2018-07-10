const usernameExists = async (db, collection, username) => {
  try {
    const exists = await db.collection(collection)
      .count({
        username,
      });
    if (exists === 0) {
      return {
        success: true,
      };
    }
    return {
      errors: {
        name: 'Username already exists',
      },
    };
  } catch (e) {
    return {
      errors: {
        name: 'Caught an error while finding if username exists or not',
      },
    };
  }
};

export default usernameExists;

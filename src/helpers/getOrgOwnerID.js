
const getOwnerID = async (db, collection, id) => {
  try {
    const orgArray = await db.collection(collection)
      .find({
        id,
      }).project({
        _id: 0, ownerID: 1,
      }).toArray();
    const [orgObject] = orgArray;
    const orgID = orgObject.ownerID;
    if (orgID === undefined) {
      return null;
    }
    return orgID;
  } catch (e) {
    return 'Error fetching owner id';
  }
};

export default getOwnerID;

const createSuccessMessage = (argName, arg) => {
  /*
  argName
  * token
  * user
  */
  if (arg === undefined || arg === null) {
    return {
      success: true,
    };
  }
  return {
    success: true,
    [argName]: arg,
  };
};

export default createSuccessMessage;

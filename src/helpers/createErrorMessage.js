const createErrorMessage = message => ({
  errors: {
    name: message,
  },
});

export default createErrorMessage;

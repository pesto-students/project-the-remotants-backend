import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const validateInput = (data) => {
  const { email } = data;
  const errors = {};

  if (!Validator.isEmail(email)) {
    errors.name = 'Email is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validations = {
  validateInput,
};

export default validations;

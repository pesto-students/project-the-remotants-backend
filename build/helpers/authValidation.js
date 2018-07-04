'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateInput = function validateInput(data) {
  var email = data.email;

  var errors = {};

  if (!_validator2.default.isEmail(email)) {
    errors.name = 'Email is invalid';
  }

  return {
    errors: errors,
    isValid: (0, _isEmpty2.default)(errors)
  };
};

var validations = {
  validateInput: validateInput
};

exports.default = validations;
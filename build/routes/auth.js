'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUser = exports.registerUser = exports.addUser = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _database = require('../database');

var _helpers = require('../helpers');

var _authValidation = require('../helpers/authValidation');

var _authValidation2 = _interopRequireDefault(_authValidation);

var _constants = require('../config/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var route = _express2.default.Router();

var addUser = exports.addUser = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(db, collection, email, password) {
    var hashedPassword;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _helpers.generateHash)(password);

          case 3:
            hashedPassword = _context.sent;
            _context.next = 6;
            return db.collection(collection).insertOne({
              email: email,
              password: hashedPassword
            });

          case 6:
            return _context.abrupt('return', {
              success: true
            });

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', {
              errors: {
                name: '[Register]: Caught an error while adding user to the Database.'
              }
            });

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 9]]);
  }));

  return function addUser(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var registerUser = exports.registerUser = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(db, collection, _ref3) {
    var email = _ref3.email,
        password = _ref3.password;
    var found;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return db.collection(collection).count({ email: email });

          case 3:
            found = _context2.sent;

            if (!(found === 0)) {
              _context2.next = 8;
              break;
            }

            _context2.next = 7;
            return addUser(db, collection, email, password);

          case 7:
            return _context2.abrupt('return', _context2.sent);

          case 8:
            return _context2.abrupt('return', {
              errors: {
                name: 'User exists'
              }
            });

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', {
              errors: {
                name: '[Register]: Caught an error while registering user.'
              }
            });

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 11]]);
  }));

  return function registerUser(_x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();

var loginUser = exports.loginUser = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(db, collection, _ref5) {
    var email = _ref5.email,
        password = _ref5.password;
    var user, hashedPassword, match, token;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return db.collection(collection).findOne({ email: email });

          case 3:
            user = _context3.sent;

            if (!(user === null)) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt('return', {
              errors: {
                name: 'Email entered is incorrect'
              }
            });

          case 6:
            hashedPassword = user.password;
            _context3.next = 9;
            return (0, _helpers.compareHash)(password, hashedPassword);

          case 9:
            match = _context3.sent;

            if (!(match === false)) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt('return', {
              errors: {
                name: 'Password entered is incorrect'
              }
            });

          case 12:
            token = (0, _helpers.createToken)(user.email);
            return _context3.abrupt('return', {
              success: true,
              token: token
            });

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3['catch'](0);
            return _context3.abrupt('return', {
              errors: {
                name: '[Login]: Caught an error while getting user from the database.'
              }
            });

          case 19:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 16]]);
  }));

  return function loginUser(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

route.post('/register', function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
    var db, collection, formData, _validations$validate, errors, isValid, response;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _database.getDb)();

          case 2:
            db = _context4.sent;
            collection = _constants.productionConstants.USERS_COLLECTION;
            formData = req.body;
            _validations$validate = _authValidation2.default.validateInput(formData), errors = _validations$validate.errors, isValid = _validations$validate.isValid;

            if (isValid) {
              _context4.next = 10;
              break;
            }

            res.json({ errors: errors });
            _context4.next = 14;
            break;

          case 10:
            _context4.next = 12;
            return registerUser(db, collection, formData);

          case 12:
            response = _context4.sent;

            res.json(response);

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());

route.post('/login', function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
    var db, collection, formData, _validations$validate2, errors, isValid, response;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _database.getDb)();

          case 2:
            db = _context5.sent;
            collection = _constants.productionConstants.USERS_COLLECTION;
            formData = req.body;
            _validations$validate2 = _authValidation2.default.validateInput(formData), errors = _validations$validate2.errors, isValid = _validations$validate2.isValid;

            if (isValid) {
              _context5.next = 10;
              break;
            }

            res.json({ errors: errors });
            _context5.next = 14;
            break;

          case 10:
            _context5.next = 12;
            return loginUser(db, collection, formData);

          case 12:
            response = _context5.sent;

            res.json(response);

          case 14:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());

exports.default = route;
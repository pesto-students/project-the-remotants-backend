'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userExists = exports.compareHash = exports.generateHash = exports.verifyToken = exports.createToken = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _constants = require('./config/constants');

var _database = require('./database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userExists = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(db, collection, email) {
    var userArray, _userArray, user;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return db.collection(collection).find({
              email: email
            }).project({
              _id: 0, email: 1
            }).toArray();

          case 3:
            userArray = _context.sent;
            _userArray = (0, _slicedToArray3.default)(userArray, 1), user = _userArray[0];

            if (!(user === null)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', null);

          case 7:
            return _context.abrupt('return', user.email);

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', null);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 10]]);
  }));

  return function userExists(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var createToken = function createToken(email) {
  var token = _jsonwebtoken2.default.sign({ email: email }, _constants.productionConstants.SECRET, {
    expiresIn: Math.floor(new Date().getTime() / 1000) + +_constants.productionConstants.ONE_DAY
  });
  return token;
};

var verifyToken = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(token) {
    var res;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _jsonwebtoken2.default.verify(token, _constants.productionConstants.SECRET, function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(err, decoded) {
                var email, db, collection, user;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!err) {
                          _context2.next = 2;
                          break;
                        }

                        return _context2.abrupt('return', {
                          errors: {
                            name: 'Failed to authenticate: ' + err
                          }
                        });

                      case 2:
                        email = decoded.email;
                        _context2.next = 5;
                        return (0, _database.getDb)();

                      case 5:
                        db = _context2.sent;
                        collection = 'users';
                        _context2.prev = 7;
                        _context2.next = 10;
                        return userExists(db, collection, email);

                      case 10:
                        user = _context2.sent;

                        if (!(user === null)) {
                          _context2.next = 13;
                          break;
                        }

                        return _context2.abrupt('return', {
                          errors: {
                            name: 'No such user'
                          }
                        });

                      case 13:
                        return _context2.abrupt('return', {
                          success: true,
                          user: user
                        });

                      case 16:
                        _context2.prev = 16;
                        _context2.t0 = _context2['catch'](7);
                        return _context2.abrupt('return', {
                          errors: {
                            name: 'Caught an error while checking if the user exists or not.'
                          }
                        });

                      case 19:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined, [[7, 16]]);
              }));

              return function (_x5, _x6) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 2:
            res = _context3.sent;
            return _context3.abrupt('return', res);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function verifyToken(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

var generateHash = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(plainText) {
    var hash;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _bcrypt2.default.hash(plainText, +_constants.productionConstants.SALT_ROUNDS);

          case 2:
            hash = _context4.sent;
            return _context4.abrupt('return', hash);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function generateHash(_x7) {
    return _ref4.apply(this, arguments);
  };
}();

var compareHash = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(plainText, hash) {
    var match;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _bcrypt2.default.compare(plainText, hash);

          case 2:
            match = _context5.sent;
            return _context5.abrupt('return', match);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function compareHash(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.generateHash = generateHash;
exports.compareHash = compareHash;
exports.userExists = userExists;
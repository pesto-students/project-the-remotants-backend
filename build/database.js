'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDb = exports.getDbClient = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongodb = require('mongodb');

var _constants = require('./config/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MONGO_URL = _constants.productionConstants.DB_URL;
var DB_NAME = _constants.productionConstants.DB_NAME;


var connectionInstance = void 0;

var getDbClient = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(connectionInstance === undefined)) {
              _context.next = 4;
              break;
            }

            _context.next = 3;
            return _mongodb.MongoClient.connect(MONGO_URL, { useNewUrlParser: true });

          case 3:
            connectionInstance = _context.sent;

          case 4:
            return _context.abrupt('return', connectionInstance);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getDbClient() {
    return _ref.apply(this, arguments);
  };
}();

var getDb = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getDbClient();

          case 2:
            if (!(connectionInstance === undefined)) {
              _context2.next = 4;
              break;
            }

            throw new Error('No connection instance present');

          case 4:
            return _context2.abrupt('return', connectionInstance.db(DB_NAME));

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getDb() {
    return _ref2.apply(this, arguments);
  };
}();

exports.getDbClient = getDbClient;
exports.getDb = getDb;
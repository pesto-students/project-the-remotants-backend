'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var authorizationHeader, token, _authorizationHeader$, _authorizationHeader$2, _ref2, success, user, errors;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            authorizationHeader = req.headers.authorization;
            token = void 0;


            if (authorizationHeader) {
              _authorizationHeader$ = authorizationHeader.split(' ');
              _authorizationHeader$2 = (0, _slicedToArray3.default)(_authorizationHeader$, 2);
              token = _authorizationHeader$2[1];
            }

            if (!token) {
              _context.next = 19;
              break;
            }

            _context.prev = 4;
            _context.next = 7;
            return (0, _helpers.verifyToken)(token);

          case 7:
            _ref2 = _context.sent;
            success = _ref2.success;
            user = _ref2.user;
            errors = _ref2.errors;

            if (success === true) {
              req.currentUser = user;
              next();
            } else {
              res.json(errors);
            }
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](4);

            res.json({
              name: 'Caught an error at the time of verifying token.'
            });

          case 17:
            _context.next = 20;
            break;

          case 19:
            res.json({
              name: 'No token provided'
            });

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 14]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _dashboard = require('./routes/dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _constants = require('./config/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use((0, _morgan2.default)('dev'));
app.use((0, _cors2.default)());
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));

app.use('/auth', _auth2.default);
app.use('/dashboard', _dashboard2.default);

app.get('/', function (req, res) {
  res.send("Roll over to /test to see it it's working or not");
});

app.get('/test', function (req, res) {
  res.json({ status: 'Working!' });
});

var server = app.listen(_constants.productionConstants.PORT, function () {
  console.log('Backend is running on PORT: ' + _constants.productionConstants.PORT);
});

exports.default = server;
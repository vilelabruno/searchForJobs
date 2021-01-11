var express = require('express');
var app = express();

var FacebookController = require('./controller/Facebook');
app.use('/Facebook', FacebookController);

module.exports = app;
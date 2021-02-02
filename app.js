var express = require('express');
var app = express();

var FirstContact = require('./controller/FirstContact');
app.use('/FirstContact', FirstContact);

module.exports = app;
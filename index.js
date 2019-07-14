const express = require("express");

var employeeController = require('./controllers/employeeController.js');
var app = require('./test');
const { mongoose } = require('./db.js');

var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

app.use('/employees', employeeController);


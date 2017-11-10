var Bamazon = require("./bamazonBasic.js");
var inquirer = require("inquirer");

var bamazon;
var connection;

Bamazon.initialize(function (response) {
  bamazon = response;
  connection = bamazon.connection; 
  connection.connect(function(err) {
    if (err) throw err;
    connection.end();
  });
});


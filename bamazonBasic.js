var CRUD = require("./crud.js");
var inquirer = require("inquirer");
var fs = require("fs");
require("console.table");


var Bamazon = function(database, password) {
  CRUD.call(this, database, password, "root", "localhost", 3306);
  this.tableSizes = {
    products: {
      id: 6,
      name: 40,
      department: 30,
      price: 14,
      stock: 6
    }
  };
  //Prints the entire table for specified table
  //table is a string or array of the mySQL table(s) to print in the bamazon database
  //options is an object of optional paramaters specified in CRUD.js CRUD object .READ function
  this.printTable = function(table, callback) {
    var options = { select: "*" };
    if (typeof arguments[1] === "object") {
      options = arguments[1];
      callback = arguments[2];
    }
    this.READ(table, options, function(data) {
      if (data.length > 0) {
        console.log("");
        console.table(data);
      }
      callback(data);
    });
  }
  //Prints out a table in the command line if returned
  //query is all the text after SELECT in a mySQL command
  //callback is a function called after the mySQL command responds
  //returns the response from the mySQL server.
  this.printSelectQueryTable = function(query, callback) {
    this.READ(query, { query: true }, function(data) {
      if (data.length > 0) {
        console.log("");
        console.table(data);
      }
      callback(data);
    });
  }


};

Bamazon.prototype = Object.create(CRUD.prototype);
Bamazon.prototype.constructor = Bamazon;

function makeConnection(bamazon, callback){
    bamazon.connection.connect(function(err) {
      if (err) throw err;
       console.log("\nConnection Successful\n");
      callback(bamazon);
    });

}

module.exports.initialize = function(callback) {
  var file = "./password.txt";
  if (fs.existsSync(file)) {
    var password = fs.readFileSync(file, "utf8");
    var bamazon = new Bamazon("bamazon", password);
    makeConnection(bamazon, callback);
  } else {
    inquirer.prompt([
      { name: "password", type: "password", message: "Enter Database Password", mask: "*" }
    ]).then(function(res) {
      if (res.password === undefined) res.password = "";
      var bamazon = new Bamazon("bamazon", res.password);
      makeConnection(bamazon, callback);
      fs.writeFile(file, res.password, function(err) { if (err) throw err; });
    });
  }
}

module.exports.validateNumber = function(val) {
  return (!isNaN(parseFloat(val)) && isFinite(val)) ? true : "Enter a number";
}

module.exports.validateDollar = function(val) {
  return (!isNaN(parseFloat(val)) && /^[0-9]*(\.[0-9][0-9])*$/.test(val)) ? true : "Enter a dollar price";
}

module.exports.validateWholeNumber = function(val) {
  return (val % 1 === 0 && val >= 0) ? true : "Enter a whole number";
}
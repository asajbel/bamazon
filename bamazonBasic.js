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
  this.printTable = function(table, callback) {
    this.READ(table, function(data) {
      console.table(data);
      callback(data);
    });
  }
};

Bamazon.prototype = Object.create(CRUD.prototype);
Bamazon.prototype.constructor = Bamazon;

module.exports.initialize = function(callback) {
  var file = "./password.txt";
  if (fs.existsSync(file)) {
    var password = fs.readFileSync(file, "utf8");
    var bamazon = new Bamazon("bamazon", password);
    callback(bamazon);
    // getTableInformation(bamazon);
  } else {
    inquirer.prompt([
      { name: "password", type: "password", message: "Enter Database Password", mask: "*" }
    ]).then(function(res) {
      if (res.password === undefined) res.password = "";
      var bamazon = new Bamazon("bamazon", res.password);
      callback(bamazon);
      fs.writeFile(file, res.password, function(err) { if (err) throw err; });
    });
  }
}
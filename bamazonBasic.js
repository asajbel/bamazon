var CRUD = require("./crud.js");
var inquirer = require("inquirer");
var fs = require("fs");

var Bamazon = function(database, password) {
  CRUD.call(this, database, password, "root", "localhost", 3306);
  this.idSize = 11;
  this.nameSize = 40;
  this.departSize = 30;
  this.priceSize = 14;
  this.stockSize = 11;
};

Bamazon.prototype = Object.create(CRUD.prototype);
Bamazon.prototype.constructor = Bamazon;

module.exports = Bamazon;
module.exports.initialize = function(callback) {
  var file = "./password.txt";
  if (fs.existsSync(file)) {
    var password = fs.readFileSync(file, "utf8");
    var bamazon = new Bamazon("bamazon", password);
    callback(bamazon);
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
var mysql = require("mysql");
const assert = require("assert");

module.exports =
  function(database, password, user, host, port) {
    assert(database !== undefined, "No Database Specified");
    assert(password !== undefined, "Require Password"); 
    (user !== undefined) ? user = user: user = "root";
    (host !== undefined) ? host = host: host = "localhost";
    (port !== undefined) ? port = port: port = 3306;
    this.connection = mysql.createConnection({
      host: host,
      port: port,
      user: user,
      password: password,
      database: database
    });

    this.CREATE = function(table, set) {
      var query = "INSERT INTO ? SET ?";
      this.connection.query(query, [table, set], function(err, res) {
        if (err) {
          throw err;
        }
      });
    };

    this.READ = function(table) {
      assert(table !== undefined, "Specicify Table");
      var columns;
      var where;
      var listener;
      if (typeof arguments[1] == "object") {
        options = arguments[1];
        listener = arguments[2];
      } else {
        options = {};
        listener = arguments[1];
      }
      var query = "SELECT ? FROM ?";
    };

    this.UPDATE = function(table, set, where) {
      assert(table === undefined || set === undefined || where === undefined,
        "Specicify table set and where");
      var query = "UPDATE ? SET ? WHERE ?";
      this.connection.qeury(query, [table, set, where], function(err, res) {
        if (err) {
          throw err;
        };
      });
    };

    this.DELETE = function() {

    };
  }
var mysql = require("mysql");
const assert = require("assert");

//Object that creates and stores a connection to a MySQL server
//Has functions to CREATE READ UPDATE and DELETE
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

    //Creates a new entry in the database
    //table is the name of the table or an array of table names
    //set is an object containing the values to set for hte table
    this.CREATE = function(table, set) {
      var query = "INSERT INTO ?? SET ?";
      var call = this.connection.query(query, [table, set], function(err, res) {
        if (err) {
          throw err;
        }
      });
    };

    //Reads tables specified in from
    //From is the name of the table or and array of tables
    //options is an object of optional parameters
    //listener is a callback function to be performed after everything is done in the READ
    //options can be:
    //  select: the columns or columns to read
    //  where: an object where keys are columns where the value is true or
    //    a string of arguments where values for columns are true
    //  having: a string of arguments where values for columns are true
    //  orderBy: 
    //  limit:
    this.READ = function(from, listener) {
      assert(arguments.length >= 2, "Specicify FROM and a callback function");
      var select, where, groupBy, having, orderBy, limit;
      var params = [];
      if (typeof arguments[1] == "object") {
        assert(typeof arguments[2] === "function", "requires callback function");
        select = arguments[1].select;
        where = arguments[1].where;
        groupBy = arguments[1].groupBy;
        having = arguments[1].having;
        orderBy = arguments[1].orderBy;
        limit = arguments[1].limit
        listener = arguments[2];
      } else {
        assert(typeof arguments[1] === "function", "requires callback function");
        listener = arguments[1];
      }
      if (select === undefined) select = "*";
      params.push(select);
      params.push(from);
      var query = "SELECT ?? FROM ??"
      if (where !== undefined) {
        if (typeof where === "string") {
          query += " WHERE " + where
        } else {
          query += " WHERE ?";
          params.push(where);
        }
      }
      if (groupBy !== undefined) {
        query += " GROUP BY ??";
        params.push(groupBy);
      }
      if (having !== undefined) {
        query += " HAVING " + having;
        // params.push(having);
      }
      if (orderBy !== undefined) {
        query += " ORDER BY ??";
        params.push(orderBy);
      }
      if (limit !== undefined) {
        query += " LIMIT ??";
        params.push(limit);
      }
      var call = this.connection.query(query, params, function(err, res) {
        if (err) throw err;
        listener(res);
      });

    };

    //Updates values in the table specified
    //table the name of the table or array of tables names
    //set is a string setting values spefied or
    // an object with a key and value pair mapping to the column and value
    //where is a sting specifiying the columns by value in the cell or
    // and object with a key and value pair mapping to the column and value
    this.UPDATE = function(table, set, where, callback) {
      assert(table !== undefined || set !== undefined || where !== undefined,
        "Specicify table set and where");
      var params = [table];
      var query = "UPDATE ??";
      if (typeof set === "string") {
        query += " SET " + set
      } else {
        query += " SET ?";
        params.push(set);
      }
      if (typeof where === "string") {
        query += " WHERE " + where
      } else {
        query += " WHERE ?";
        params.push(where);
      }
      var call = this.connection.query(query, params, function(err, res) {
        if (err) {
          throw err;
        };
        callback(res);
      });
      console.log(call.sql);
    };

    //Deletes a row from the tables specified
    //table is the table or array of tables
    //where is an object with a key and values pairs 
    //  mapping to where the column and value are true
    this.DELETE = function(table, where, callback) {
      assert(table !== undefined || set !== undefined || where !== undefined,
        "Specicify table set and where");
      var query = "DELETE FROM ?? WHERE ?";
      var call = this.connection.query(query, [table, where], function(err, res) {
        if (err) throw err;
        callback(res);
      });
      console.log(call.sql);
    };

    //Ends the connection to the sql server.
    this.end = function() {
      this.connection.end();
    };
  }
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
      var query = "INSERT INTO ?? SET ?";
      var call = this.connection.query(query, [table, set], function(err, res) {
        if (err) {
          throw err;
        }
      });
    };

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

    this.end = function() {
      this.connection.end();
    };
  }
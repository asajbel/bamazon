var Bamazon = require("./bamazonBasic.js");
var inquirer = require("inquirer");

var bamazon;

Bamazon.initialize(function(response) {
  bamazon = response;
  bamazon.connection.connect(function(err) {
    if (err) throw err;
    storeFront();
  });
});

function storeFront() {
	console.log("");
  bamazon.printTable("products", function(res) {
    chooseBid();
  });
}

function chooseBid() {
  inquirer.prompt([{
      type: "input",
      name: "id",
      message: "What is the ID of the item you would like to purchase? [Quit with Q]",
      validate: function(val) { return (/([0-9])+|q|Q/.test(val)) ? true : "Enter a number"; }
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like? [Quit with Q]",
      when: function(answers) {
        return /[^q|Q]/.test(answers.id);
      },
      validate: function(val) { return (/([0-9])+|q|Q/.test(val)) ? true : "Enter a number"; }
    }
  ]).then(function(answers) {
    var quit = (/[q|Q]/.test(answers.id)) || (/[q|Q]/.test(answers.quantity));
    if (quit) {
      bamazon.end();
    } else {
      checkItem(answers.id, answers.quantity, function(update) {
        if(update){
        	storeFront();
        }else {
        	chooseBid();
        }
      })
    }

  });
}

function checkItem(id, quantity, callback) {
  bamazon.READ("products", {
    where: "item_id = " + id,
    having: "stock_quantity > " + quantity,
  }, function(res) {
    if (res.length < 1) {
      console.log("\nInsufficient quantity or does not exist.\n");
      callback(false);
    } else {
    	var updatedStock = res[0].stock_quantity - parseInt(quantity);
    	bamazon.UPDATE("products", {stock_quantity: updatedStock}, {item_id: res[0].item_id},
    		function () {
    			var amount = parseInt(quantity) * res[0].price;
    			console.log("\nYou bought "+quantity+" "+res[0].product_name+" for $"+amount+".");
    			callback(true);
    		});
    }
  });
}
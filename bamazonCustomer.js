var Bamazon = require("./bamazonBasic.js");
var inquirer = require("inquirer");

var bamazon;

Bamazon.initialize(function(response) {
  bamazon = response;
  storeFront();
});

function storeFront() {
  bamazon.printTable(
    "products", { select: ["item_id", "product_name", "department_name", "price", "stock_quantity"] },
    function(res) {
      purchase();
    });
}

function validateNumberQuit(val) {
  return ((val % 1 === 0 && val >= 0) || val.toLowerCase() === "q") ? true : "Enter a whole number";
}

function purchase() {
  inquirer.prompt([{
      type: "input",
      name: "id",
      message: "What is the ID of the item you would like to purchase? [Quit with Q]",
      validate: validateNumberQuit
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like? [Quit with Q]",
      when: function(answers) {
        return /[^q|Q]/.test(answers.id);
      },
      validate: validateNumberQuit
    }
  ]).then(function(answers) {
    var quit = (/[q|Q]/.test(answers.id)) || (/[q|Q]/.test(answers.quantity));
    if (quit) {
      bamazon.end();
    } else {
      checkItem(answers.id, answers.quantity, function(update) {
        if (update) {
          storeFront();
        } else {
          purchase();
        }
      })
    }

  });
}

function checkItem(id, quantity, callback) {
  bamazon.READ("products", {
    where: { item_id: id },
    having: ["stock_quantity > " + quantity],
  }, function(res) {
    if (res.length < 1) {
      console.log("\nInsufficient quantity or does not exist.\n");
      callback(false);
    } else {
      var amount = (quantity * res[0].price).toFixed(2);
      var set = "stock_quantity = stock_quantity - " + quantity;
      set += ", product_sales = product_sales + " + amount;
      bamazon.UPDATE("products", set, { item_id: res[0].item_id },
        function() {
          console.log("\nYou bought " + quantity + " " + res[0].product_name + " for $" + amount + ".");
          callback(true);
        });
    }
  });
}
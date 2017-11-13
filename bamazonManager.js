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
  inquirer.prompt([{
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
  }]).then(function(answers) {
    switch (answers.action) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewLow();
        break;
      case "Add to Inventory":
        addInventory();
        break;
      case "Add New Product":
        addProduct();
        break;
      case "Quit":
        bamazon.end();
        break;
      default:
    }
  });
}

function viewProducts() {
  bamazon.printTable(
    "products", {
      select: ["item_id", "product_name", "price", "stock_quantity"]
    },
    function(res) {
      storeFront();
    });
}

function viewLow() {
  bamazon.printTable(
    "products", {
      select: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
      having: ["stock_quantity < 5"]
    },
    function(res) {
      if (res.length < 1) {
        console.log("\nNo low Inventory\n");
      }
      storeFront();
    });
}

function addInventory() {
  bamazon.READ("products", { select: ["product_name", "stock_quantity"] },
    function(res) {
      var products = [];
      for (var i = 0; i < res.length; i++) {
        products.push(res[i].product_name);
      }
      var prompt = [{
          name: "product",
          type: "list",
          message: "To what Product do you want to add supply?",
          choices: products
        },
        {
          name: "amount",
          type: "input",
          message: "How much stock to add?",
          validate: Bamazon.validateWholeNumber
        }
      ];
      inquirer.prompt(prompt).then(function(answers) {
        var stock = 0;
        for (var i = 0; i < res.length; i++) {
          if (answers.product === res[i].product_name) {
            stock = res[i].stock_quantity;
          }
        }
        var addStock = parseInt(answers.amount) + parseInt(stock);
        bamazon.UPDATE("products", { stock_quantity: addStock }, { product_name: answers.product },
          function(res) {
            console.log("\nAdded " + answers.amount + " of " + answers.product + " to inventory.\n");
            storeFront();
          });
      });
    });
}

function addProduct() {
  bamazon.READ("departments", { select: "department_name" }, function(res) {
  	var departmentNames = [];
  	for (var i = 0; i < res.length; i++) {
  		departmentNames.push(res[i].department_name);
  	}
    var prompt = [{
        name: "name",
        message: "What is the name of the product you would like to add?",
        type: "input"
      },
      {
        name: "department",
        message: "To what department does this product belong?",
        type: "list",
        choices: departmentNames
      },
      {
        name: "price",
        message: "What is the product's price?",
        type: "input",
        validate: Bamazon.validateDollar
      },
      {
        name: "stock",
        message: "How much stock do we have of the product?",
        type: "input",
        validate: Bamazon.validateWholeNumber
      }
    ];
    inquirer.prompt(prompt).then(function(answers) {
      bamazon.CREATE("products", {
        product_name: answers.name,
        department_name: answers.department,
        price: parseFloat(answers.price),
        stock_quantity: answers.stock
      }, function(res) {
      	storeFront();
      });
    });
  });

}
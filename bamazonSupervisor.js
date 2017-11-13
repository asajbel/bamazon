var Bamazon = require("./bamazonBasic.js");
var inquirer = require("inquirer");
var bamazon;

Bamazon.initialize(function(response) {
  bamazon = response;
  storeFront();
});

function storeFront() {
  var options = ["View Product Sales by Department", "Create New Department", "Quit"];
  inquirer.prompt([{
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: options
  }]).then(function(answers) {
    switch (answers.action) {
      case options[0]:
        viewProductSales();
        break;
      case options[1]:
        createDepartment();
        break;
      case options[2]:
        bamazon.end();
        break;
      default:
    }
  });
}

function viewProductSales() {
  var query =
    "departments.department_id, departments.department_name, departments.over_head_costs, \
		SUM(products.product_sales) AS product_sales,  \
		(SUM(products.product_sales) - departments.over_head_costs) AS total_profit\
		FROM departments \
		LEFT JOIN products ON departments.department_name = products.department_name\
		GROUP BY department_name\
		ORDER BY department_id;"
  bamazon.printTable(query, { query: true }, function(data) {
    if (data.length < 1) {
      console.log("\nSomething went horribly wrong.\n")
    }
    storeFront();
  });
}

function createDepartment() {
  var prompt = [{
      name: "name",
      message: "Enter name of new department",
      type: "input"
    },
    {
      name: "costs",
      message: "Enter the over head cost",
      type: "input",
      validate: Bamazon.validateDollar
    }
  ];
  inquirer.prompt(prompt).then(function(answers) {
    bamazon.CREATE("departments", { department_name: answers.name, over_head_costs: answers.costs },
      function(res) {
        console.log("\nAdded Department\n");
        storeFront();
      });
  });
}
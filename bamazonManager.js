var inquirer = require('inquirer');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon_db',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

var pmpt = inquirer.createPromptModule()
var prompt = inquirer.createPromptModule()
var pt = inquirer.createPromptModule()

var id;
var quantity;
var newName;
var newDepartment;
var newPrice;
var newQuantity;

var qs = [
    {
        type: 'list',
        name: 'command',
        message: 'Menu',
        choices: ['View Products for Sale','View Low Inventory Items', 'Add to Inventory', 'Add New Product']
    },
]

var questions = [
    {
        type: 'input',
        name: 'addq1',
        message: "What is ID of the product you would like to add more of?",
        validate: function validateaddq1(name){
            return name !== '';
        }
    },
    {
        type: 'input',
        name: 'addq2',
        message: "How many units of the product they would like to buy?",
        validate: function validateaddq2(name){
            return name !== '';
        }
    },
]

var newQuestions = [
    {
        type: 'input',
        name: 'q1',
        message: "What is the name of the product?",
        validate: function validateq1(name){
            return name !== '';
        }
    },
    {
        type: 'input',
        name: 'q2',
        message: "What department does the product belong to?",
        validate: function validateq2(name){
            return name !== '';
        }
    },
    {
        type: 'input',
        name: 'q3',
        message: "What is the price of the product?",
        validate: function validateq3(name){
            return name !== '';
        }
    },
    {
        type: 'input',
        name: 'q4',
        message: "How many of the product is in stock?",
        validate: function validateq4(name){
            return name !== '';
        }
    },
]

function start() {
    pmpt(qs).then(function(answers){
        switch (answers.command) {
            case 'View Products for Sale' :
            view()
            break;
            case 'View Low Inventory Items':
            lowInventory()
            break;
            case 'Add to additional Product Inventory' :
            addInventory()
            break;
            case 'Add New Product' :
            addProduct()
            break;
        }
    })
}

function view() {
    connection.query('SELECT * FROM products', function(e, r){
        if(e) throw e;
        for(var i=0; i<r.length; i++){
            console.log("Item ID #" + r[i].item_id + ": \n\t Product Name: " + r[i].product_name + " \n\t Department: " + r[i].department_name + "\n\t Price: $" + r[i].price + ".00"+ "\n\t Stock Quantity: " + r[i].stock_quantity + "")
        }
    })
    start()
}

function lowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(e, r){
        if(e) throw e;
        for(var i=0; i<r.length; i++){
            console.log("\n Item ID #" + r[i].item_id + ": \n\t Product Name: " + r[i].product_name + " \n\t Department: " + r[i].department_name + "\n\t Price: $" + r[i].price + ".00"+ "\n\t Stock Quantity: " + r[i].stock_quantity + "")
        }
    })
    start()
}

function addInventory() {
    console.log("hi")
    prompt(questions).then(function(answer) {
        id = answer.addq1[0]
        quantity = answer.addq2[0]
        console.log(answer.addq1[0])
        console.log(id)
        updateDB()
    })
}

function updateDB(){
    connection.query('SELECT stock_quantity FROM products WHERE item_id='+ id +' ', function(e, r){
        if(e) throw e;
        var currentStock = r[0].stock_quantity;
        console.log(currentStock);
        connection.query('UPDATE products SET stock_quantity = stock_quantity + '+ quantity +' WHERE item_id='+ id +'', function(e, r){
            if(e) throw e;
            console.log("You have successfully added more products!") 
        })
    })
    start()
}

function addProduct() {
    pt(newQuestions).then(function(answer) {
        newName = answer.q1[0];
        newDepartment = answer.q2[0];
        newPrice = answer.q3[0];
        newQuantity = answer.q4[0];
        console.log(answer.q4[0])
        addDB()
    })
}

function addDB(){
    connection.query('INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES ("'+ newName+', "'+ newDepartment +'", '+ newPrice +', '+ newQuantity +')', function(e, r){
        if(e) throw e;
    console.log(r)
    console.log("New Item added.")
    })
    start()
}

start()
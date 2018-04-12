var inquirer = require('inquirer');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon_db',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

var pmpt = inquirer.createPromptModule();
var id;
var quantity;

var qs = [
    {
        type: 'input',
        name: 'postq1',
        message: "What is ID of the product you would like to buy?",
        validate: function validatepostq1(name){
            return name !== '';
        }
    },
    {
        type: 'input',
        name: 'postq2',
        message: "How many units of the product they would like to buy?",
        validate: function validatepostq2(name){
            return name !== '';
        }
    },
]

function startCustomer(){
    connection.query('SELECT * FROM products', function(e, r){
        if(e) throw e;
        for(var i=0; i<r.length; i++){
            console.log("Item ID #" + r[i].item_id + ": \n\t Product Name: " + r[i].product_name + " \n\t Department: " + r[i].department_name + "\n\t Price: $" + r[i].price + ".00")
        }
        questions()
    })
}

function questions() {
    pmpt(qs).then(function(answer) {
        id = answer.postq1[0]
        quantity = answer.postq2[0]
        console.log(answer.postq1[0])
        console.log(id)
        updateDB()
    })
}

function updateDB() {
    connection.query('SELECT stock_quantity FROM products WHERE item_id='+ id +' ', function(e, r){
        if(e) throw e;
        var currentStock = r[0].stock_quantity;
        console.log(currentStock);
        if(currentStock-quantity <= 0) {
            console.log("Insufficient quantitiy, please try again.")
            startCustomer()
        } else {
            connection.query('UPDATE products SET stock_quantity = stock_quantity - '+ quantity +' WHERE item_id='+ id +'', function(e, r){
                if(e) throw e;
                console.log("You have successfully made a purchase!") 
            })
            connection.query('SELECT * FROM products WHERE item_id='+ id +' ', function(e, r){
            if(e) throw e;
            })
        }
    })
}

startCustomer()

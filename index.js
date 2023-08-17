// packages needed
const mysql = require('mysql2');
const inquirer = require("inquirer");

// creates a connect with your database
const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },

);

async function queryRoles() {
    return new Promise((resolve, reject) => {
        let query = "select * from role"
        db.query(query, function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

async function queryEmployee() {
    return new Promise((resolve, reject) => {
        let query = "select * from employee"
        db.query(query, function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// the startApplication fuction is the main function where are code is in. AC: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role. <- user must make a secltion. Use inquire.prompt to list chocices and propt the user to make a selection.

// .then we are (returning user input) AC:WHEN I choose to view all departments will run the first if statement as true and excute viewAllDepartments() taking us to line 71. If the user picked a different option, it would excute those functions instead.
function startApplication() {
    inquirer
        .prompt({
            name: "initalPrompt",
            type: "list",
            message: "Please pick of of the following options",
            choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "exit"]
        })
        .then((userAnswer) => {
            if (userAnswer.initalPrompt === "view all departments") {
                viewAllDepartments()

            } else if (userAnswer.initalPrompt === "view all roles") {
                viewAllRoles()
            } else if (userAnswer.initalPrompt === "view all employees") {
                viewAllEmployees()
            } else if (userAnswer.initalPrompt === "add a department") {
                addDepartment()
            } else if (userAnswer.initalPrompt === "add a role") {
                addRoles()
            } else if (userAnswer.initalPrompt === "add an employee") {
                addAnEmployee()
            } else if (userAnswer.initalPrompt === "update an employee role") {
                updateEmployeeRoles()
            } else {
                db.end()
            }
        })

};

// crud - create, read, update, delete
// create - insert into, read: select, update and delete are the same

// let query is set to a SQL statement. SELECT statements are used to select data from a database. The data returned is stored in a result table (w3schools) SELECT Syntax: SELECT Table1, optionalTable2, FROM table_name
// SELECT Syntax to select all fields available in a table: SELECT *FROM table_name. The let query is selecting the complete departments table
function viewAllDepartments() {
    let query = "select * from department"
    db.query(query, function (error, response) {
        if (error) {
            console.log(error)
        }
        console.table(response);
        startApplication()
    })
};

// viewAllDepartments(), viewALLRoles(),viewAllEmployees() all function very similarly.  The let query is only thing changing to fulfill AC: WHEN I choose to view all roles THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role. SELECT the whole contents FROM table of role and combines or JOIN the department table ON role
function viewAllRoles() {
    console.log("viewAllRoles")
    let query = "select * from role LEFT JOIN department ON role.department_id = department.id"
    db.query(query, function (error, response) {
        if (error) {
            console.log(error)
        }
        console.table(response);
        startApplication()
    })
};
// ON statement is the condition. INNER JOIN takes away tables that do not satisfy the join condition set by the ON statement. In this case the ON is saying 
function viewAllEmployees() {
    let query = "select T1.id, T1.first_name, T1.last_name, role.title, role.salary CONCAT(T2.first_name, T2.last_name) as managerName from employee T1  INNER JOIN employee T2 ON T1.manager_id = T2.id INNER JOIN role ON T1.role_id = role.id";
    // let query = "Select * from role INNER Join employee";
    db.query(query, function (error, response) {
        if (error) {
            console.log(error)
        }
        console.table(response);
        startApplication()
    })
};

function addDepartment() {
    inquirer
        .prompt({
            name: "addedDepartment",
            type: "input",
            message: "What department would you like to add?"
        })

        .then((userAddedDepartment) => {
            let query = "insert into department set ?"
            db.query(query, {
                name: userAddedDepartment.addedDepartment
            }, function (err, res) {
                startApplication()
            })
        })
};

function addRoles() {
    inquirer
        .prompt([{
                name: "addedRole",
                type: "input",
                message: "What is the role you would like to add?"
            },
            {
                name: "departmentID",
                message: "Select which department id?",
                type: "input"

            },

            {
                name: "pay",
                message: "What is their salary?",
                type: "input"
            }
        ])

        .then((answers) => {
            let query = "insert into role set ?"
            db.query(query, {
                title: answers.addedRole,
                salary: answers.pay,
                department_id: answers.departmentID
            }, function (err, res) {
                startApplication()
            })
        })

};

async function addAnEmployee() {
    const roles = await queryRoles()
    console.log(roles);
    inquirer
        .prompt([{
                name: "firstName",
                type: "input",
                message: "What is your first name?"
            },
            {
                name: "lastName",
                message: "What is your last name?",
                type: "input"

            },

            {
                name: "roleID",
                message: "What is your role?",
                type: "list",
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                name: "managerID",
                message: "What is your manager id?",
                type: "input"
            }
        ])

        .then((answers) => {
            let query = "insert into employee set ?"
            db.query(query, {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleID,
                manager_id: answers.managerID,
            }, function (err, res) {
                startApplication()
            })
        })

};

// .map() is a method on an array that creates an populates a new array when the function is called. .map syntax: array.map(function(currentValue, index, arr), thisValue). In this case we have an array of objects
async function updateEmployeeRoles() {
    const roles = await queryRoles()
    const employees = await queryEmployee()
    inquirer
        .prompt([{
                name: "update",
                message: "Select an employee to update",
                type: "list",
                choices: employees.map(employee => ({
                    name: employee.first_name + employee.last_name,
                    value: employee.id
                }))
            },
            {
                name: "updatedRole",
                message: "What is the updated role?",
                type: "list",
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            }
        ])
        .then(answers => {
            let query = "update employee set ? where ?"
            db.query(query, [{role_id: answers.updatedRole} , {id: answers.update}], function (err) {
                if (err) {
                    console.log(err);
                }
                startApplication()
            })
        })
};

startApplication();
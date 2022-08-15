// .env file
require("dotenv").config();
// ascii art
var figlet = require("figlet");
const inquirer = require("inquirer");
// db object
const db = require("./lib/queries");
// console.table formatter
const cTable = require("console.table");
// inquirer questions arrays
const {
  addDepartmentQuestions,
  addEmployeeQuestions,
  addRoleQuestions,
  updateEmployeeRoleQuestions,
  deleteDepartmentQuestions,
  updateEmployeeManagerQuestions,
  deleteEmpQuestions,
  deleteRoleQuestions,
  empByDeptQuestions,
  empByManagerQuestion,
  totalUtilizedBudgetQuestion,
  mainMenuQuestions,
} = require("./lib/questions");

// call the main menu with all possible options
function mainMenu() {
  inquirer.prompt(mainMenuQuestions).then((answers) => {
    switch (answers.view) {
      case "View all departments":
        viewDept();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "View all employees":
        viewEmployees();
        break;
      case "Add a department":
        getDepartmentQuestion();
        break;
      case "Add a role":
        getRoleQuestions();
        break;
      case "Add an employee":
        getEmployeeQuestions();
        break;
      case "Update an employee role":
        getUpdateEmployeeQuestions();
        break;
      case "Update employee manager":
        getUpdateEmployeeManagerQuestions();
        break;
      case "Delete department":
        getDeleteDeptQuestions();
        break;
      case "Delete role":
        getDeleteRoleQuestions();
        break;
      case "Delete employee":
        getDeleteEmpQuestions();
        break;
      case "View employees by department":
        getEmpByDeptQuestion();
        break;
      case "View employees by manager":
        getEmpByManagerQuestion();
        break;
      case "View total budget utilization":
        getTotalUtilizedBudgetQuestion();
        break;
      case "Quit":
        exit();
        break;
      // this should never get called
      default:
        console.error("You missed something in the switch statement");
    }
  });
}

// display all departments in database
async function viewDept() {
    console.clear();
    const [rows] = await db.getDepartments();
    console.table(rows)
    mainMenu()
}

// display all roles in database
async function viewRoles() {
    console.clear();
    const [rows] = await db.getRoles();
    console.table(rows);
    mainMenu();
}

// display all employees in database
async function viewEmployees(){
    console.clear();
    const [rows] = await db.getEmployees();
    console.table(rows);
    mainMenu();
}



// create and display the title art
console.log(
  figlet.textSync("Employee\nTracker\n", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
);
// call main menu
mainMenu();

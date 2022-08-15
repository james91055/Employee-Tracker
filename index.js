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
  console.table(rows);
  mainMenu();
}

// display all roles in database
async function viewRoles() {
  console.clear();
  const [rows] = await db.getRoles();
  console.table(rows);
  mainMenu();
}

// display all employees in database
async function viewEmployees() {
  console.clear();
  const [rows] = await db.getEmployees();
  console.table(rows);
  mainMenu();
}

// display all departments in database, User types the name of a new department. If the department name already exists, it will tell the user that the department name already exists.
async function getDepartmentQuestion() {
  console.clear();
  const [rows] = await db.getDepartments();
  const deptNamesArr = rows.map((dept) => dept.departments);
  console.table(rows);
  // What is the new department?
  inquirer.prompt(addDepartmentQuestions).then((answers) => {
    const { deptName } = answers;
    // check to see if department name already exists.
    if (!deptNamesArr.includes(deptName)) {
      db.addDepartment(deptName);
      console.clear();
      console.log(`\n-- New department was added! --\n`);
      mainMenu();
    } else {
      console.clear();
      console.log(`\n-- Department name already exists --\n`);
      mainMenu();
    }
  });
}

// display all departments in database, then let the user name a new role, choose the department for the new role, add salary information, and add the role to the database.
async function getRoleQuestions() {
  // show all departments
  console.clear();
  const [rows] = await db.getDepartments();
  console.table(rows);
  const deptArr = rows.map((item) => item.id);

  inquirer.prompt(addRoleQuestions).then((answers) => {
    const { deptId, roleName, salary } = answers;
    // check if department exists and that the role name is less than 60 characters
    if (deptArr.includes(parseInt(deptId)) && roleName.length < 60) {
      db.addRole(roleName, parseInt(salary), parseInt(deptId));
      console.clear();
      console.log(`\n-- Role was successfully added to database! --\n`);
      mainMenu();
    } else {
      console.clear();
      console.log(
        `\n-- Error adding to database. Please varify the department ID and that the role name is less than 60 characters. --\n `
      );
      mainMenu();
    }
  });
}

// Display all manager positions and roles. User chooses the new employee name, role, and manager. User can also leave manager blank to make the new emplyee a manager.
async function getEmployeeQuestions() {
  console.clear();
  // show managers to get their IDs
  const [drows] = await db.getEmployeesByDepartment(3);
  console.table(drows);
  //show roles so that user can see ID numbers
  const [roleRows] = await db.getRoles();
  console.table(roleRows);
  // make employees array to check if manager_id exists
  const [erows] = await db.getManagers();
  const empArr = erows.map((e) => e.manager_id);
  // make roles array to check if roles_id exists
  const [rrows] = await db.getRoles();
  const rolesArr = rrows.map((item) => item.role_id);

  // series of questions about the new employee
  inquirer.prompt(addEmployeeQuestions).then((answers) => {
    let { fName, lName, role, isManager } = answers;
    // check if new employee is a manager
    if (isManager !== "") {
      // check if manager and role exist
      if (
        empArr.includes(parseInt(isManager)) &&
        rolesArr.includes(parseInt(role))
      ) {
        db.addEmployee(fName, lName, parseInt(role), parseInt(isManager));
        console.clear();
        console.log(`\n--${fName} ${lName} was added to database--\n`);
        mainMenu();
      } else {
        console.clear();
        console.log(
          "\n -- Manager ID or Role ID does not exist, please double check the IDs for both. --\n"
        );
        mainMenu();
      }
    } else {
      isManager = null;
      // check if role exists
      if (rolesArr.includes(parseInt(role))) {
        db.addEmployee(fName, lName, parseInt(role), isManager);
        console.clear();
        console.log(`\n-- ${fName} ${lName} was added to database --\n`);
        mainMenu();
      } else {
        console.clear();
        console.error("\n --Role was not found --\n");
        mainMenu();
      }
    }
  });
}

// Display all employees and their roles. User can select the employee to change, then select a new role.
async function getUpdateEmployeeQuestions() {
  console.clear();
  // show info to update employee role
  const [mrows] = await db.getEmployeeRoleInfo();
  const empIdsArr = mrows.map((emp) => emp.id);
  const rolesIdArr = mrows.map((emp) => emp.role_id);
  console.table(mrows);

  inquirer.prompt(updateEmployeeRoleQuestions).then((answers) => {
    const { empId, newRole } = answers;
    const eId = parseInt(empId);
    const nRole = parseInt(newRole);
    // check if employee and new role exist
    if (empIdsArr.includes(eId) && rolesIdArr.includes(nRole)) {
      db.updateEmployeeRole(eId, nRole);
      const empIndex = empIdsArr.indexOf(eId);
      const rIndex = rolesIdArr.indexOf(nRole);
      console.clear();
      console.log(
        `\n--${mrows[empIndex].employee_name}'s role has been changed to ${mrows[rIndex].role}--\n`
      );
      mainMenu();
    } else {
      console.clear();
      console.log(
        "\n-- Either the employee number or the role ID is incorrect.--\n"
      );
      mainMenu();
    }
  });
}

// Display employees, allow user to select an employee and change their manager. If the user wants to promote an emplyee and make them a manager, they would need to use the 'Update employee role' option.
async function getUpdateEmployeeManagerQuestions() {
  const [rows] = await db.getEmployeeManagerInfo();
  const idArr = rows.map((emp) => emp.employee_id);
  const manIdArr = rows.map((man) => man.manager_id);
  console.table(rows);

  inquirer.prompt(updateEmployeeManagerQuestions).then((answers) => {
    const { empId, newManager } = answers;
    const eId = parseInt(empId);
    const mId = parseInt(newManager);
    // check if employee exists
    if (idArr.includes(eId)) {
      // check if manager exists
      if (manIdArr.includes(mId)) {
        db.updateEmployeeManager(eId, mId);

        console.clear();
        console.log(`--\nChanged Employee's Manager!--\n`);
        mainMenu();
      } else {
        console.clear();
        console.error(
          "\n-- The ID for the manager was not in the database.--\n"
        );
        mainMenu();
      }
    } else {
      console.clear();
      console.error(
        "\n-- The ID you entered did not match any employees. --\n"
      );
      mainMenu();
    }
  });
}

// Display all departments, allow the user to select a department to delete.
async function getDeleteDeptQuestions() {
  console.clear();
  // display all departments
  const [rows] = await db.getDepartments();
  const deptIdArr = rows.map((rows) => rows.id);
  console.table(rows);
  // which department to delete?
  inquirer.prompt(deleteDepartmentQuestions).then((answers) => {
    const { dept } = answers;
    const deptInt = parseInt(dept);
    // check if department exists
    if (deptIdArr.includes(deptInt)) {
      db.deleteDepartment(deptInt);
      console.clear();
      console.log(`\n-- Department was successfully deleted! --\n`);
      mainMenu();
    } else {
      console.clear();
      console.log(`\n-- Department ID was not found --\n`);
      mainMenu();
    }
  });
}

// Display roles, allow the user to delete any role.
async function getDeleteRoleQuestions() {
  // show roles
  console.clear();
  const [rows] = await db.getRoles();
  const rolesArr = rows.map((role) => role.role_id);
  console.table(rows);
  // which role to delete?
  inquirer.prompt(deleteRoleQuestions).then((answers) => {
    const { role } = answers;
    const roleInt = parseInt(role);
    // check if role exists
    if (rolesArr.includes(roleInt)) {
      db.deleteRole(roleInt);
      console.clear();
      console.log(`\n-- Role was successfully deleted! --\n`);
      mainMenu();
    } else {
      console.clear();
      console.log(`\n-- Role ID was not found --\n`);
      mainMenu();
    }
  });
}

// Display all employees, allow user to select an employee to delete.
async function getDeleteEmpQuestions() {
  console.clear();

  const [rows] = await db.getEmployees();
  const empArr = rows.map((emp) => emp.id);
  console.table(rows);

  inquirer.prompt(deleteEmpQuestions).then((answers) => {
    const { emp } = answers;
    const empInt = parseInt(emp);
    // check if employee exists
    if (empArr.includes(empInt)) {
      db.deleteEmp(empInt);
      console.clear();
      console.log(`\n-- Employee was successfully deleted! --\n`);
      mainMenu();
    } else {
      console.clear();
      console.log(`\n-- Employee ID was not found --\n`);
      mainMenu();
    }
  });
}

// Display all departmnet, allow user to select a department, then display all employees under that department.
async function getEmpByDeptQuestion() {
  const [rows] = await db.getDepartments();
  const deptArr = rows.map((dept) => dept.id);
  console.table(rows);
  inquirer
    .prompt(empByDeptQuestions)
    .then(async (answer) => {
      const { dept } = answer;
      const deptInt = parseInt(dept);
      // check if department exists
      if (deptArr.includes(deptInt)) {
        console.clear();
        const [rows] = await db.getEmployeesByDepartment(deptInt);
        console.table(rows);
        mainMenu();
      } else {
        console.clear();
        console.log(`\n-- Department ID was not found --\n`);
        mainMenu();
      }
    })
    .catch((err) => {
      if (err) {
        console.clear();
        console.error(err);
        mainMenu();
      }
    });
}

// Display all managers, allow user to select a manager to display all of their subordinance.
async function getEmpByManagerQuestion() {
  const [rows] = await db.getAllManagers();
  const manIdArr = rows.map((man) => man.id);
  console.table(rows);

  inquirer.prompt(empByManagerQuestion).then(async (answer) => {
    const { manager } = answer;
    const managerInt = parseInt(manager);
    // check if manager exists
    if (manIdArr.includes(managerInt)) {
      console.clear();
      const [rows] = await db.getEmpsByManager(managerInt);
      console.table(rows);
      mainMenu();
    } else {
      console.clear();
      console.log(`\n-- Manager ID was not found --\n`);
      mainMenu();
    }
  });
}

// Display all departments and allow user to view the sum of all salaries within the department.
async function getTotalUtilizedBudgetQuestion() {
  console.clear();
  const [rows] = await db.getDepartments();
  console.table(rows);
  // which department?
  inquirer
    .prompt(totalUtilizedBudgetQuestion)
    .then(async (answer) => {
      const { dept } = answer;
      const [rows] = await db.getTotalUtilizedBudget(parseInt(dept));
      const salariesArr = rows.map((salary) => parseInt(salary.salary));
      const initialValue = 0;
      const sumWithInitial = salariesArr.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
      );
      let sumWithCommas = sumWithInitial.toLocaleString("en-US");
      // will display $0 if the department does not exist.
      console.log(
        `\n -- The total budget utilized for this department is $${sumWithCommas} --\n`
      );
      mainMenu();
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
}
// exit the program
function exit() {
  process.exit();
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

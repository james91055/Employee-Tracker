use employees_db;

INSERT INTO department (id, name)
VALUES
    (1,'Human Resources'),
    (2,'Marketing'),
    (3,'Information Technology'),
    (4,'Accounting');

INSERT INTO role
    (id, title, salary, department_id)
VALUES
    (1,'HR Manager', 100000, 1),
    (2,'HR', 85000, 1),
    (3,'Marketing Director', 140000, 2),
    (4,'Sales', 70000, 2),
    (5,'IT Director', 195000, 3),
    (6,'Desktop Support', 100000, 3),
    (7,'Account Manager', 110000, 4),
    (8,'Accountant', 90000, 4);

INSERT INTO employee
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1,'Harry', 'Kuo', 1, NULL),
    (2,'Max', 'Gonzales', 2, 1),
    (3,'Calvin', 'Kim', 3, NULL),
    (4,'James', 'Chang', 4, 3),
    (5,'Maria', 'Kong', 4, 3),
    (6,'Sheri', 'Green', 5, NULL),
    (7,'Jonathan', 'Prune', 6, 5),
    (8,'Andrew', 'Romans', 6, 5),
    (9,'Julius', 'Thomas', 7, NULL),
    (10,'Sari', 'Rodriguez', 7, 8);
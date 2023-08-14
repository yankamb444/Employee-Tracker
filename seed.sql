INSERT INTO department (name)
VALUES ("Department One"),
       ("Department Two");


INSERT INTO role (title, salary, department_id)
VALUES ("Nurse", 60000, 1 ),
        ("Doctor", 100000, 2);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tommy", "Smith", 1, NULL ), ( "Jenny", "Smith", 1, );
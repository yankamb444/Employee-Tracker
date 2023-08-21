-- Mini project seeds file for code structure 
-- creates the columns we need based on the image in the challenge
INSERT INTO department (name)
VALUES ("Department One"),
       ("Department Two");


-- table of role has three properties title, salary, department_id, each return a value. Department_id is auto Inc, so that's a number 
INSERT INTO role (title, salary, department_id)
VALUES ("Nurse", 60000, 1 ),
        ("Doctor", 100000, 2);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tommy", "Smith", 1, NULL ), ( "Jenny", "Smith", 1, );
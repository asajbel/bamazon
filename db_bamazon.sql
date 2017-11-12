SET SQL_SAFE_UPDATES = 0;

drop database if exists bamazon;
create database bamazon;

use bamazon;

create table products (
	item_id integer(6) auto_increment not null,
    product_name varchar(40) not null,
    department_name varchar(20) not null,
    price decimal(14,2) not null,
    stock_quantity integer(6) not null,
    primary key (item_id)
);

insert into products(product_name, department_name, price, stock_quantity)
values ("Deluxe Transformer", "Toys", 18.99, 153);

insert into products(product_name, department_name, price, stock_quantity)
values ("Quick Rise Dry Yeast", "Food and Drinks", 8.99, 300);

insert into products(product_name, department_name, price, stock_quantity)
values ("AA Batteries 12-Pack", "Electronics", 6.99, 452);

insert into products(product_name, department_name, price, stock_quantity)
values ("Game of Thrones: Season 2 Blu-Ray", "Movies and TV", 32.99, 4);

insert into products(product_name, department_name, price, stock_quantity)
values ("Eyeglass Cleaner 2-Pack", "Vision Care", 10.56, 482);

insert into products(product_name, department_name, price, stock_quantity)
values ("Toilet Paper 27 pack", "Bathroom", 18.00, 345);

insert into products(product_name, department_name, price, stock_quantity)
values ("Candy Bar", "Food and Drinks", 1.02, 6548);

insert into products(product_name, department_name, price, stock_quantity)
values ("Thor: Ragnanarok Blu-Ray", "Movies and TV", 22.99, 2314);

insert into products(product_name, department_name, price, stock_quantity)
values ("Avacado", "Food and Drinks", 0.19 , 352);

insert into products(product_name, department_name, price, stock_quantity)
values ("Drone", "Electronics", 2350.00, 24); 

select * from products;

create table departments (
	department_id integer(11) auto_increment not null,
    department_name varchar(20) not null,
    over_head_costs decimal(14,2) not null,
    primary key (department_id)
);

insert into departments (department_name, over_head_costs)
values ("Movies and TV", 1000);

insert into departments (department_name, over_head_costs)
values ("Food and Drinks", 3000);

insert into departments (department_name, over_head_costs)
values ("Electronics", 2000);

insert into departments (department_name, over_head_costs)
values ("Toys", 1000);

insert into departments (department_name, over_head_costs)
values ("Bathroom", 1000);

insert into departments (department_name, over_head_costs)
values ("Vision Care", 1000);

insert into departments (department_name, over_head_costs)
values ("Health and Beauty", 1000);

select * from departments;

alter table products add product_sales decimal(14,2) default 0;

update products set product_sales = price * (stock_quantity / 3);

select * from products;

SET SQL_SAFE_UPDATES = 1;
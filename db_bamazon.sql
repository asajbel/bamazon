drop database if exists bamazon;
create database bamazon;

use bamazon;

create table products (
	item_id integer(11) auto_increment not null,
    product_name varchar(40) not null,
    department_name varchar(20) not null,
    price float(14,2) not null,
    stock_quantity integer(11) not null,
    primary key (item_id)
);

insert into products(product_name, department_name, price, stock_quantity)
values ("Deluxe Transformer", "Toys", 18.99, 153);

insert into products(product_name, department_name, price, stock_quantity)
values ("Quick Rise Dry Yeast", "Food and Drinks", 8.99, 300);

insert into products(product_name, department_name, price, stock_quantity)
values ("AA Batteries 12-Pack", "Electronics", 6.99, 452);

insert into products(product_name, department_name, price, stock_quantity)
values ("Game of Thrones: Season 2 Blu-Ray", "Movies and TV", 32.99, 239);

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
values ("Drone", "Electonics", 2350.00, 24); 

select * from products;
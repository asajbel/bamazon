use bamazon;

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA='bamazon' 
    AND TABLE_NAME='products';
    
SHOW columns FROM products;

SELECT MAX(CHAR_LENGTH(item_id)), MAX(CHAR_LENGTH(product_name)), MAX(CHAR_LENGTH(department_name)), MAX(CHAR_LENGTH(price)), MAX(CHAR_LENGTH(stock_quantity)) FROM products;

SELECT table_name, column_name FROM information_schema.tables, INFORMATION_SCHEMA.columns where table_schema='bamazon';

SELECT * FROM products WHERE department_name="Food and Drinks";

select * from products where item_id="2" having stock_quantity > 350;

select * from products where item_id='5' having stock_quantity < 5;

DELETE FROM products WHERE item_id < 5;

SELECT * FROM products; 

UPDATE products SET stock_quantity=5 WHERE item_id=6 and stock_quantity > 5;

Alter table products drop product_sales;

SELECT departments.department_id, departments.department_name, departments.over_head_costs, 
SUM(products.product_sales) AS product_sales,  (SUM(products.product_sales) - departments.over_head_costs) AS total_profit
FROM departments 
LEFT join products ON departments.department_name = products.department_name
group by department_name
order by department_id;



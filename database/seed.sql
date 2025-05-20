-- Use the database
USE sales_dashboard;

-- Seed products table
INSERT INTO products (name, description, category, price, stock_quantity, reorder_level) VALUES
('Laptop Pro', 'High-performance laptop for professionals', 'Electronics', 1299.99, 45, 15),
('Smartphone X', 'Latest smartphone with advanced features', 'Electronics', 899.99, 60, 20),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 'Electronics', 199.99, 100, 30),
('Smart Watch', 'Fitness and health tracking smartwatch', 'Electronics', 249.99, 75, 25),
('Tablet Air', 'Lightweight tablet for productivity', 'Electronics', 499.99, 50, 15),
('Coffee Maker', 'Programmable coffee maker with timer', 'Home Appliances', 79.99, 30, 10),
('Blender Pro', 'High-powered blender for smoothies', 'Home Appliances', 129.99, 25, 8),
('Toaster Oven', 'Convection toaster oven with multiple settings', 'Home Appliances', 89.99, 20, 7),
('Microwave Oven', 'Countertop microwave with smart features', 'Home Appliances', 149.99, 15, 5),
('Refrigerator', 'Energy-efficient refrigerator', 'Home Appliances', 899.99, 10, 3),
('Running Shoes', 'Lightweight running shoes for athletes', 'Sports', 89.99, 120, 40),
('Yoga Mat', 'Non-slip yoga mat for fitness', 'Sports', 29.99, 80, 25),
('Dumbbells Set', 'Adjustable dumbbells for home workouts', 'Sports', 149.99, 35, 10),
('Basketball', 'Official size basketball', 'Sports', 39.99, 50, 15),
('Tennis Racket', 'Professional tennis racket', 'Sports', 129.99, 25, 8),
('T-Shirt', 'Cotton t-shirt in various colors', 'Clothing', 19.99, 200, 50),
('Jeans', 'Denim jeans in multiple styles', 'Clothing', 49.99, 150, 40),
('Sweater', 'Warm winter sweater', 'Clothing', 59.99, 100, 30),
('Jacket', 'Waterproof outdoor jacket', 'Clothing', 89.99, 75, 25),
('Dress Shoes', 'Formal leather dress shoes', 'Clothing', 99.99, 60, 20),
('Desk Chair', 'Ergonomic office chair', 'Furniture', 199.99, 20, 5),
('Coffee Table', 'Modern coffee table for living room', 'Furniture', 149.99, 15, 5),
('Bookshelf', 'Wooden bookshelf with multiple shelves', 'Furniture', 129.99, 25, 8),
('Bed Frame', 'Queen size bed frame', 'Furniture', 299.99, 10, 3),
('Dining Table', 'Extendable dining table for 6', 'Furniture', 349.99, 8, 3);

-- Generate sales data for the past 24 months
-- This is a simplified version; in a real application, you would have more varied data

-- Helper procedure to generate random sales
DELIMITER //
CREATE PROCEDURE generate_sales_data()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE product_count INT;
    DECLARE random_product_id INT;
    DECLARE random_quantity INT;
    DECLARE product_price DECIMAL(10, 2);
    DECLARE total_price DECIMAL(10, 2);
    DECLARE random_date TIMESTAMP;
    DECLARE random_region VARCHAR(100);
    DECLARE order_id_val VARCHAR(50);
    DECLARE regions VARCHAR(500) DEFAULT 'North America,Europe,Asia,South America,Africa,Oceania';
    
    -- Get product count
    SELECT COUNT(*) INTO product_count FROM products;
    
    -- Generate sales for the past 24 months
    WHILE i < 5000 DO
        -- Random product
        SET random_product_id = FLOOR(1 + RAND() * product_count);
        
        -- Random quantity between 1 and 10
        SET random_quantity = FLOOR(1 + RAND() * 10);
        
        -- Get product price
        SELECT price INTO product_price FROM products WHERE id = random_product_id;
        
        -- Calculate total
        SET total_price = product_price * random_quantity;
        
        -- Random date in the past 24 months
        SET random_date = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 730) DAY);
        
        -- Random region
        SET random_region = ELT(FLOOR(1 + RAND() * 6), 'North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania');
        
        -- Generate order ID (simplified)
        SET order_id_val = CONCAT('ORD-', FLOOR(10000 + RAND() * 90000));
        
        -- Insert sale record
        INSERT INTO sales (order_id, product_id, quantity, unit_price, total_amount, sale_date, region)
        VALUES (order_id_val, random_product_id, random_quantity, product_price, total_price, random_date, random_region);
        
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

-- Call the procedure to generate sales data
CALL generate_sales_data();

-- Drop the procedure
DROP PROCEDURE IF EXISTS generate_sales_data;

CREATE DATABASE book_management;

USE Book_Management;


CREATE TABLE books (
    id_book INT AUTO_INCREMENT,
    title NVARCHAR(70),
    category NVARCHAR(50),
    author NVARCHAR(30),
    quantity INT,
    price DECIMAl(10,2),
    
    CONSTRAINT PK_BOOK PRIMARY KEY (id_book)
);

CREATE TABLE customers (
    id_customer INT AUTO_INCREMENT,
    full_name NVARCHAR(30),
    address NVARCHAR(50),
    phone VARCHAR(10),
    email VARCHAR(50),
    debt DECIMAL(10,2),
    CONSTRAINT PK_customers PRIMARY KEY (id_customer)
);

CREATE TABLE stock_receipts (
    id_stock_receipt VARCHAR(6),
    receipt_date DATE,
    CONSTRAINT PK_stock_receipts PRIMARY KEY (id_stock_receipt)
);

CREATE TABLE stock_receipts_details (
    id_stock_receipt VARCHAR(6),
    id_book INT,
    quantity INT,
    CONSTRAINT PK_stock_receipts_details PRIMARY KEY (id_stock_receipt, id_book),
    CONSTRAINT FK_stock_receipts_details_stock_receipts FOREIGN KEY (id_stock_receipt) REFERENCES stock_receipts(id_stock_receipt),
    CONSTRAINT FK_stock_receipts_details_BOOK FOREIGN KEY (id_book) REFERENCES books(id_book)
);

CREATE TABLE invoices (
    id_invoice VARCHAR(6),
    id_customer INT,
    invoices_DATE DATE, 
    CONSTRAINT PK_invoices PRIMARY KEY (id_invoice),
    CONSTRAINT FK_invoices_customers FOREIGN KEY (id_customer) REFERENCES customers(id_customer)
);

CREATE TABLE invoices_details (
    id_invoice VARCHAR(6),
    id_book INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    CONSTRAINT PK_invoices_details PRIMARY KEY (id_invoice, id_book),
    CONSTRAINT FK_invoices_details_invoices FOREIGN KEY (id_invoice) REFERENCES invoices(id_invoice),
    CONSTRAINT FK_invoices_details_BOOK FOREIGN KEY (id_book) REFERENCES books(id_book)
);

DROP TABLE IF EXISTS payment_receipts; 

CREATE TABLE payment_receipts (
    id_payment_receipt VARCHAR(6),
    id_customer INT,
    payment_date DATE,
    amount_received DECIMAL(10,2),
    CONSTRAINT PK_payment_receipts PRIMARY KEY (id_payment_receipt),
    CONSTRAINT FK_customers FOREIGN KEY (id_customer) REFERENCES customers(id_customer)
);

CREATE TABLE stock_reports (
    id_stock_report VARCHAR(6),
    report_date DATE,
    CONSTRAINT PK_stock_reports PRIMARY KEY (id_stock_report)
);

CREATE TABLE stock_reports_details (
    id_stock_report VARCHAR(6),
    id_book INT,
    initial_stock DECIMAL(10,2),
    changes DECIMAL(10,2),
    final_stock DECIMAL(10,2),
    CONSTRAINT PK_stock_reports_details PRIMARY KEY (id_stock_report, id_book),
    CONSTRAINT FK_stock_reports_details_stock_reports FOREIGN KEY (id_stock_report) REFERENCES stock_reports(id_stock_report),
    CONSTRAINT FK_stock_reports_details_BOOK FOREIGN KEY (id_book) REFERENCES books(id_book)
);

CREATE TABLE debt_reports (
    id_debt_report VARCHAR(6),
    report_date DATE,
    CONSTRAINT PK_debt_reports PRIMARY KEY (id_debt_report)
);

CREATE TABLE debt_reports_details (
    id_debt_report VARCHAR(6),
    id_customer INT,
    initial_debt DECIMAL(10,2),
    changes DECIMAL(10,2),
    FINAL_debt DECIMAL(10,2),
    CONSTRAINT PK_debt_reports_DETAILS PRIMARY KEY (id_debt_report, id_customer),
    CONSTRAINT FK_debt_reports_DETAILS_debt_reports FOREIGN KEY (id_debt_report) REFERENCES debt_reports(id_debt_report),
    CONSTRAINT FK_debt_reports_DETAILS_customers FOREIGN KEY (id_customer) REFERENCES customers(id_customer)
);

CREATE TABLE rules (
    id_rule INT PRIMARY KEY AUTO_INCREMENT,
    rule_name VARCHAR(255),
    rule_value int
);



-- Insert data into BOOK table
INSERT INTO books (title, category, author, quantity) VALUES
('The Alchemist', 'Novel', 'Paulo Coelho', 10),
('When Breath Becomes Air', 'Biography', 'Paul Kalanithi', 5),
('In Search of Lost Time', 'Novel', 'Marcel Proust', 8);

-- Insert data into customers table
INSERT INTO customers (full_name, address, phone, email, debt) VALUES
('Nguyen Van A', 'Hanoi', '0123456789', 'a@gmail.com', 10000.00),
('Tran Thi B', 'Ho Chi Minh City', '0987654321', 'b@gmail.com', 15000.00),
('Le Van C', 'Da Nang', '0112233445', 'c@gmail.com', 5000.00);

-- Insert data into stock_receipts table
INSERT INTO stock_receipts (id_stock_receipt, receipt_date) VALUES
('SR001', '2023-01-15'),
('SR002', '2023-02-20');

-- Insert data into stock_receipts_details table
INSERT INTO stock_receipts_details (id_stock_receipt, id_book, quantity) VALUES
('SR001', 1, 5),
('SR001', 2, 3),
('SR002', 3, 2);

-- Insert data into invoices table
INSERT INTO invoices (id_invoice, id_customer, invoices_DATE) VALUES
('INV001', 1, '2023-01-20'),
('INV002', 2, '2023-02-25');

-- Insert data into invoices_details table
INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES
('INV001', 1, 2, 200.00),
('INV001', 2, 1, 150.00),
('INV002', 3, 1, 300.00);

-- Insert data into payment_receipts table
INSERT INTO payment_receipts (id_payment_receipt, id_customer, payment_date, amount_received) VALUES
('PR001', 1, '2023-01-21', 300.00),
('PR002', 2, '2023-02-26', 1500.00);

-- Insert data into stock_reports table
INSERT INTO stock_reports (id_stock_report, report_date) VALUES
('SR001', '2023-03-01');

-- Insert data into stock_reports_details table
INSERT INTO stock_reports_details (id_stock_report, id_book, initial_stock, changes, final_stock) VALUES
('SR001', 1, 10, -5, 5),
('SR001', 2, 5, -3, 2),
('SR001', 3, 8, 0, 8);

-- Insert data into debt_reports table
INSERT INTO debt_reports (id_debt_report, report_date) VALUES
('DR001', '2023-03-05');

-- Insert data into debt_reports_DETAILS table
INSERT INTO debt_reports_details (id_debt_report, id_customer, initial_debt, changes, FINAL_debt) VALUES
('DR001', 1, 10000.00, -300.00, 9700.00),
('DR001', 2, 15000.00, 500.00, 15500.00);



INSERT INTO rules (rule_name, rule_value) VALUES ('Max inventory quantity', 300);
INSERT INTO rules (rule_name, rule_value) VALUES ('Max debt', 20000);
INSERT INTO rules (rule_name, rule_value) VALUES ('Min book quantity after selling', 20);


use book_management;


DROP TRIGGER IF EXISTS check_max_debt;

DELIMITER $$
CREATE TRIGGER check_max_debt
BEFORE UPDATE ON customers
FOR EACH ROW
BEGIN
	DECLARE max_debt decimal(10,2);
    DECLARE debt_curr decimal(10,2);
    
    SELECT CAST(rule_value as UNSIGNED) into max_debt
    from rules
    where rule_name = "Max debt";
    
    SELECT CAST(debt as UNSIGNED) into debt_curr
    from customers
    where id_customer = OLD.id_customer;
    
    if debt_curr > max_debt  then
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lượng tồn kho hiện tại đã lớn hơn hoặc bằng giới hạn cho phép'; 
    END IF;
END $$
    
DELIMITER ;




DROP TRIGGER IF EXISTS check_inventory;
DELIMITER $$

CREATE TRIGGER check_inventory
BEFORE UPDATE ON books
FOR EACH ROW
BEGIN
    DECLARE max_quantity decimal(10,2);


    SELECT CAST(rule_value AS UNSIGNED) INTO max_quantity 
    FROM rules 
    WHERE rule_name = 'Max inventory quantity';

    IF OLD.quantity >= max_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lượng tồn kho hiện tại đã lớn hơn hoặc bằng giới hạn cho phép'; 
    END IF;
END $$

DELIMITER ;



drop trigger if exists check_min_inventory_after;

DELIMITER $$

CREATE TRIGGER  check_min_inventory_after
BEFORE UPDATE ON books
FOR EACH ROW
BEGIN
    DECLARE min_inventory_after INT;
    SELECT CAST(rule_value AS UNSIGNED) INTO min_inventory_after
    FROM rules 
    WHERE rule_name = 'Min book quantity after selling';


    IF new.quantity < min_inventory_after THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Vui lòng chọn số lượng ít hơn. Số lượng tồn sau khi bán ít nhất là 20.'; 
    END IF;
END $$

DELIMITER ;


drop trigger if exists check_amount_received;

DELIMITER $$

CREATE TRIGGER  check_amount_received
BEFORE UPDATE ON payment_receipts
FOR EACH ROW
BEGIN
	
    DECLARE curr_debt decimal(10,2);
    
    SELECT CAST(debt as UNSIGNED) into curr_debt
	from customers
    where old.id_customer = id_customer;
	
    IF old.amount_received > curr_debt THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số tiền thu đã vượt quá số tiền khách hàng đang nợ.'; 
    END IF;
END $$

DELIMITER ;

use book_management;


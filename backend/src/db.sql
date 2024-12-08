drop database if exists book_management;

CREATE DATABASE book_management;

USE Book_Management;


CREATE TABLE books (
    id_book INT AUTO_INCREMENT,
    title NVARCHAR(70),
    category NVARCHAR(50),
    author NVARCHAR(30),
    quantity INT,
    price DECIMAl(10,2),
    slug NVARCHAR(70) UNIQUE NOT NULL,
    CONSTRAINT PK_BOOK PRIMARY KEY (id_book)
);

CREATE TABLE customers (
    id_customer INT AUTO_INCREMENT,
    full_name NVARCHAR(30),
    address NVARCHAR(50),
    phone VARCHAR(10),
    email VARCHAR(50),
    debt DECIMAL(10,2) default 0,
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
    report_month INT, 
    report_year INT,
    CONSTRAINT PK_debt_reports PRIMARY KEY (id_debt_report)
);

CREATE TABLE debt_reports_details (
    id_debt_report VARCHAR(6),
    id_customer INT,
    initial_debt DECIMAL(10,2),
    changes DECIMAL(10,2),
    final_debt DECIMAL(10,2),
    CONSTRAINT PK_debt_reports_DETAILS PRIMARY KEY (id_debt_report, id_customer),
    CONSTRAINT FK_debt_reports_DETAILS_debt_reports FOREIGN KEY (id_debt_report) REFERENCES debt_reports(id_debt_report),
    CONSTRAINT FK_debt_reports_DETAILS_customers FOREIGN KEY (id_customer) REFERENCES customers(id_customer)
);

CREATE TABLE rules (
    id_rule INT PRIMARY KEY AUTO_INCREMENT,
    rule_name VARCHAR(255) NOT NULL,
    rule_value NVARCHAR(255) NOT NULL, 
    description text 
);

-- Insert data into BOOK table
INSERT INTO books (title, category, author, quantity, price,slug) VALUES
('The Alchemist', 'Novel', 'Paulo Coelho', 10, 10000.00, 'the-Alchemist'),
('When Breath Becomes Air', 'Biography', 'Paul Kalanithi', 5, 15000.00, 'When-Breath-Becomes-Air'),
('In Search of Lost Time', 'Novel', 'Marcel Proust', 8, 20000.00,'In-Search-of-Lost-Time');

-- Insert data into customers table
INSERT INTO customers (full_name, address, phone, email) VALUES
('Nguyen Van A', 'Hanoi', '0123456789', 'a@gmail.com'),
('Tran Thi B', 'Ho Chi Minh City', '0987654321', 'b@gmail.com'),
('Le Van C', 'Da Nang', '0112233445', 'c@gmail.com');

-- Insert data into stock_receipts table
INSERT INTO stock_receipts (id_stock_receipt, receipt_date) VALUES
('SR001', '2023-01-15'),
('SR002', '2023-02-20');

-- Insert data into stock_receipts_details table
INSERT INTO stock_receipts_details (id_stock_receipt, id_book, quantity) VALUES
('SR001', 1, 5),
('SR001', 2, 3),
('SR002', 3, 2);

-- Insert data into stock_reports table
INSERT INTO stock_reports (id_stock_report, report_date) VALUES
('SR001', '2023-03-01');

-- Insert data into stock_reports_details table
INSERT INTO stock_reports_details (id_stock_report, id_book, initial_stock, changes, final_stock) VALUES
('SR001', 1, 10, -5, 5),
('SR001', 2, 5, -3, 2),
('SR001', 3, 8, 0, 8);


INSERT INTO rules (rule_name, rule_value, description) VALUES 
('minImportQuantity', '150', 'Số lượng nhập tối thiểu'),
('minStockQuantityBeforeImport', '300', 'Lượng tồn tối thiểu trước khi nhập'),
('maxDebt', '20000', 'Tiền nợ tối đa'),
('minStockAfterSale', '20', 'Lượng tồn tối thiểu sau khi bán'),
('allowOverpayment', 'true', 'Số tiền thu không vƣợt quá số tiền khách hàng đang nợ');

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

DROP TRIGGER IF EXISTS books_before_update;
DELIMITER $$
CREATE TRIGGER books_before_update
BEFORE UPDATE ON books
FOR EACH ROW
BEGIN
    DECLARE max_import decimal(10,2);
    
    SELECT CAST(rule_value as UNSIGNED) into max_import
    from rules
    where rule_name = "minStockQuantityBeforeImport";
    IF OLD.quantity > max_import AND OLD.quantity < NEW.Quantity THEN
        SET @msg = CONCAT(OLD.quantity," ",OLD.title);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @msg;
    END IF;
END  $$
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

DELIMITER $$

CREATE PROCEDURE CreateOrUpdateDebtReportDetail(
    IN reportMonth INT,
    IN reportYear INT,
    IN customerID INT,
    IN changeAmount DECIMAL(10,2)
)
BEGIN
    DECLARE reportID VARCHAR(6);
    DECLARE initialDebt DECIMAL(10,2);
    DECLARE existingRecord INT;
    DECLARE nextMonth INT;
    DECLARE nextYear INT;
    DECLARE nextReportID VARCHAR(6);
    DECLARE currentFinalDebt DECIMAL(10,2);

    -- Check if a debt report exists for the given month and year
    SELECT id_debt_report INTO reportID
    FROM debt_reports
    WHERE report_month = reportMonth AND report_year = reportYear;

    -- If no report exists, create one
    IF reportID IS NULL THEN
        SET reportID = CONCAT('DR', LPAD((SELECT COUNT(*) + 1 FROM debt_reports), 4, '0'));
        INSERT INTO debt_reports (id_debt_report, report_month, report_year)
        VALUES (reportID, reportMonth, reportYear);
    END IF;

    -- Get initial debt from previous month using a temporary variable
    SET initialDebt = (
        SELECT final_debt
        FROM (
            SELECT final_debt
            FROM debt_reports_details drd
            JOIN debt_reports dr ON drd.id_debt_report = dr.id_debt_report
            WHERE id_customer = customerID
            AND (report_year < reportYear 
                 OR (report_year = reportYear AND report_month < reportMonth))
            ORDER BY report_year DESC, report_month DESC
            LIMIT 1
        ) AS previousDebt
    );

    -- If no previous report exists, use 0 as initial debt
    IF initialDebt IS NULL THEN
        SET initialDebt = 0;
    END IF;

    -- Check if record exists for this month
    SELECT COUNT(*) INTO existingRecord
    FROM debt_reports_details 
    WHERE id_debt_report = reportID AND id_customer = customerID;

    IF existingRecord > 0 THEN
        -- Record exists: Update it
        UPDATE debt_reports_details
        SET changes = changes + changeAmount,
            final_debt = initialDebt + changes
        WHERE id_debt_report = reportID AND id_customer = customerID;
    ELSE
        -- Record does not exist: Insert a new one
        INSERT INTO debt_reports_details 
            (id_debt_report, id_customer, initial_debt, changes, final_debt)
        VALUES 
            (reportID, customerID, initialDebt, changeAmount, initialDebt + changeAmount);
    END IF;

    -- Propagate changes to subsequent months
    SET nextMonth = reportMonth + 1;
    SET nextYear = reportYear;

    IF nextMonth > 12 THEN
        SET nextMonth = 1;
        SET nextYear = reportYear + 1;
    END IF;

    -- Get the current final debt for propagation
    SELECT final_debt INTO currentFinalDebt
    FROM debt_reports_details
    WHERE id_debt_report = reportID AND id_customer = customerID;

    WHILE EXISTS (
        SELECT 1 FROM debt_reports
        WHERE report_month = nextMonth AND report_year = nextYear
    ) DO
        -- Get the next report ID
        SELECT id_debt_report INTO nextReportID
        FROM debt_reports
        WHERE report_month = nextMonth AND report_year = nextYear;

        -- Update initial debt for next report
        UPDATE debt_reports_details
        SET initial_debt = currentFinalDebt
        WHERE id_debt_report = nextReportID AND id_customer = customerID;

        -- Update final debt for next report
        UPDATE debt_reports_details
        SET final_debt = initial_debt + changes
        WHERE id_debt_report = nextReportID AND id_customer = customerID;

        -- Move to the next month
        SET reportID = nextReportID;
        SET nextMonth = nextMonth + 1;

        IF nextMonth > 12 THEN
            SET nextMonth = 1;
            SET nextYear = nextYear + 1;
        END IF;

        -- Get the updated final debt for propagation
        SELECT final_debt INTO currentFinalDebt
        FROM debt_reports_details
        WHERE id_debt_report = reportID AND id_customer = customerID;
    END WHILE;

END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER AfterInsertInvoiceDetails
AFTER INSERT ON invoices_details
FOR EACH ROW
BEGIN
    DECLARE totalAmount DECIMAL(10,2);

    -- Calculate the updated total amount for the invoice
    SELECT SUM(quantity * unit_price) INTO totalAmount
    FROM invoices_details
    WHERE id_invoice = NEW.id_invoice;

    -- Update customer's debt
    UPDATE customers
    SET debt = debt + (NEW.quantity * NEW.unit_price)
    WHERE id_customer = (SELECT id_customer FROM invoices WHERE id_invoice = NEW.id_invoice);

    -- Update debt report detail
    CALL CreateOrUpdateDebtReportDetail(
        MONTH((SELECT invoices_DATE FROM invoices WHERE id_invoice = NEW.id_invoice)),
        YEAR((SELECT invoices_DATE FROM invoices WHERE id_invoice = NEW.id_invoice)),
        (SELECT id_customer FROM invoices WHERE id_invoice = NEW.id_invoice),
        NEW.quantity * NEW.unit_price
    );
END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER AfterUpdateInvoice
AFTER UPDATE ON invoices_details
FOR EACH ROW
BEGIN
    DECLARE oldAmount DECIMAL(10,2);
    DECLARE newAmount DECIMAL(10,2);
    DECLARE changeInAmount DECIMAL(10,2);
    DECLARE invoiceDate DATE;
    DECLARE customerID INT;

    -- Calculate old and new invoice totals
    SET oldAmount = OLD.quantity * OLD.unit_price;
    SET newAmount = NEW.quantity * NEW.unit_price;
    SET changeInAmount = newAmount - oldAmount;

    -- Get invoice date and customer ID
    SELECT invoices_DATE, id_customer INTO invoiceDate, customerID
    FROM invoices
    WHERE id_invoice = NEW.id_invoice;

    -- Update customer's debt
    UPDATE customers
    SET debt = debt + changeInAmount
    WHERE id_customer = customerID;

    -- Update debt report detail
    CALL CreateOrUpdateDebtReportDetail(MONTH(invoiceDate), YEAR(invoiceDate), customerID, changeInAmount);
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER AfterInsertPayment
AFTER INSERT ON payment_receipts
FOR EACH ROW
BEGIN
    -- Update customer's debt
    UPDATE customers
    SET debt = debt - NEW.amount_received
    WHERE id_customer = NEW.id_customer;

    -- Update debt report detail
    CALL CreateOrUpdateDebtReportDetail(MONTH(NEW.payment_date), YEAR(NEW.payment_date), NEW.id_customer, -NEW.amount_received);
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER AfterUpdatePayment
AFTER UPDATE ON payment_receipts
FOR EACH ROW
BEGIN
    DECLARE changeInAmount DECIMAL(10, 2);
    
    -- Calculate the change in the payment amount
    SET changeInAmount = NEW.amount_received - OLD.amount_received;
    
    -- Update customer's debt
    UPDATE customers
    SET debt = debt - changeInAmount
    WHERE id_customer = NEW.id_customer;

    -- Update debt report detail
    CALL CreateOrUpdateDebtReportDetail(MONTH(NEW.payment_date), YEAR(NEW.payment_date), NEW.id_customer, -changeInAmount);
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER AfterDeleteInvoice
AFTER DELETE ON invoices
FOR EACH ROW
BEGIN
    DECLARE totalAmount DECIMAL(10,2);

    -- Calculate the total amount of the deleted invoice
    SELECT SUM(quantity * unit_price) INTO totalAmount
    FROM invoices_details
    WHERE id_invoice = OLD.id_invoice;

    -- Update customer's debt
    UPDATE customers
    SET debt = debt - totalAmount
    WHERE id_customer = OLD.id_customer;

    -- Update debt report detail
    CALL CreateOrUpdateDebtReportDetail(MONTH(OLD.invoices_DATE), YEAR(OLD.invoices_DATE), OLD.id_customer, -totalAmount);
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER AfterDeletePayment
AFTER DELETE ON payment_receipts
FOR EACH ROW
BEGIN
    -- Update customer's debt
    UPDATE customers
    SET debt = debt + OLD.amount_received
    WHERE id_customer = OLD.id_customer;

    -- Update debt report detail
    CALL CreateOrUpdateDebtReportDetail(MONTH(OLD.payment_date), YEAR(OLD.payment_date), OLD.id_customer, OLD.amount_received);
END $$

DELIMITER ;



-- Insert data into invoices table
INSERT INTO invoices (id_invoice, id_customer, invoices_DATE) VALUES
('INV001', 1, '2023-01-20'),
('INV002', 2, '2023-02-25'),
('INV003', 2, '2023-03-25'),
('INV004', 1, '2023-03-25');

-- Insert data into invoices_details table
INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES
('INV001', 2, 2, 150.00),
('INV002', 3, 5, 300.00),
('INV003', 1, 1, 150.00);

-- Insert data into payment_receipts table
INSERT INTO payment_receipts (id_payment_receipt, id_customer, payment_date, amount_received) VALUES
('PR001', 1, '2023-01-21', 150.00),
('PR002', 2, '2023-02-26', 1500.00),
('PR003', 1, '2023-03-21', 150.00);

INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES
('INV003', 3, 3, 150.00),
('INV004', 3, 3, 150.00);

-- INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES
-- ('INV003', 1, 1, 150.00);

use book_management;
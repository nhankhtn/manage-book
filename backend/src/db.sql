drop database if exists book_management;

CREATE DATABASE book_management;

USE Book_Management;


CREATE TABLE books (
    id_book INT AUTO_INCREMENT,
    title NVARCHAR(70),
    category NVARCHAR(50),
    author NVARCHAR(30),
    quantity INT,
    price DECIMAL(10,2),
    slug NVARCHAR(250), -- Added slug column
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
    id_stock_receipt VARCHAR(10),
    receipt_date DATE,
    CONSTRAINT PK_stock_receipts PRIMARY KEY (id_stock_receipt)
);

CREATE TABLE stock_receipts_details (
    id_stock_receipt VARCHAR(10),
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
    report_month INT,
    report_year INT,
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

use book_management;


-- DROP TRIGGER IF EXISTS check_max_debt;

-- DELIMITER $$
-- CREATE TRIGGER check_max_debt
-- BEFORE UPDATE ON customers
-- FOR EACH ROW
-- BEGIN
-- 	DECLARE max_debt decimal(10,2);
--     DECLARE debt_curr decimal(10,2);
    
--     SELECT CAST(rule_value as UNSIGNED) into max_debt
--     from rules
--     where rule_name = "Max debt";
    
--     SELECT CAST(debt as UNSIGNED) into debt_curr
--     from customers
--     where id_customer = OLD.id_customer;
    
--     if debt_curr > max_debt  then
--     SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'Lượng tồn kho hiện tại đã lớn hơn hoặc bằng giới hạn cho phép'; 
--     END IF;
-- END $$
    
-- DELIMITER ;




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
    WHERE rule_name = 'minStockAfterSale';


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

-- STOCK PROCEDURE

DELIMITER $$

CREATE PROCEDURE CreateOrUpdateStockReportDetail(
    IN reportMonth INT,  -- Tháng báo cáo
    IN reportYear INT,   -- Năm báo cáo
    IN bookID INT,
    IN changeQuantity INT
)
BEGIN
    DECLARE reportID VARCHAR(6);
    DECLARE initialStock INT DEFAULT 0;
    DECLARE existingRecord INT DEFAULT 0;
    DECLARE nextMonth INT;
    DECLARE nextYear INT;
    DECLARE nextReportID VARCHAR(6);
    DECLARE currentFinalStock INT DEFAULT 0;

    -- Lấy hoặc tạo mới ID báo cáo hiện tại
    SELECT id_stock_report INTO reportID
    FROM stock_reports
    WHERE report_month = reportMonth AND report_year = reportYear;

    IF reportID IS NULL THEN
        SET reportID = CONCAT('SR', LPAD((SELECT COUNT(*) + 1 FROM stock_reports), 4, '0'));
        INSERT INTO stock_reports (id_stock_report, report_month, report_year)
        VALUES (reportID, reportMonth, reportYear);
    END IF;

    -- Lấy tồn kho đầu kỳ từ tháng trước
    SELECT final_stock INTO initialStock
    FROM stock_reports_details srd
    JOIN stock_reports sr ON srd.id_stock_report = sr.id_stock_report
    WHERE id_book = bookID
      AND (sr.report_year < reportYear OR (sr.report_year = reportYear AND sr.report_month < reportMonth))
    ORDER BY sr.report_year DESC, sr.report_month DESC
    LIMIT 1;

    IF initialStock IS NULL THEN
        SET initialStock = 0;
    END IF;

    -- Kiểm tra tồn tại bản ghi cho sách trong báo cáo hiện tại
    SELECT COUNT(*) INTO existingRecord
    FROM stock_reports_details
    WHERE id_stock_report = reportID AND id_book = bookID;

    IF existingRecord > 0 THEN
        -- Nếu tồn tại, cập nhật
        UPDATE stock_reports_details
        SET 
            changes = changes + changeQuantity,
            final_stock = initialStock + changes
        WHERE id_stock_report = reportID AND id_book = bookID;
    ELSE
        -- Nếu không, thêm mới
        INSERT INTO stock_reports_details 
            (id_stock_report, id_book, initial_stock, changes, final_stock)
        VALUES 
            (reportID, bookID, initialStock, changeQuantity, initialStock + changeQuantity);
    END IF;

    -- Truyền thay đổi tới các tháng sau
    SET nextMonth = reportMonth + 1;
    SET nextYear = reportYear;

    IF nextMonth > 12 THEN
        SET nextMonth = 1;
        SET nextYear = nextYear + 1;
    END IF;

    -- Lấy tồn kho cuối kỳ để truyền
    SELECT final_stock INTO currentFinalStock
    FROM stock_reports_details
    WHERE id_stock_report = reportID AND id_book = bookID;

    WHILE EXISTS (
        SELECT 1 FROM stock_reports
        WHERE report_month = nextMonth AND report_year = nextYear
    ) DO
        -- Lấy ID báo cáo tiếp theo
        SELECT id_stock_report INTO nextReportID
        FROM stock_reports
        WHERE report_month = nextMonth AND report_year = nextYear;

        -- Cập nhật tồn kho đầu kỳ cho tháng tiếp theo
        UPDATE stock_reports_details
        SET initial_stock = currentFinalStock
        WHERE id_stock_report = nextReportID AND id_book = bookID;

        -- Cập nhật tồn kho cuối kỳ
        UPDATE stock_reports_details
        SET final_stock = initial_stock + changes
        WHERE id_stock_report = nextReportID AND id_book = bookID;

        -- Chuyển sang tháng tiếp theo
        SET reportID = nextReportID;
        SET nextMonth = nextMonth + 1;

        IF nextMonth > 12 THEN
            SET nextMonth = 1;
            SET nextYear = nextYear + 1;
        END IF;

        -- Lấy tồn kho cuối kỳ đã cập nhật
        SELECT final_stock INTO currentFinalStock
        FROM stock_reports_details
        WHERE id_stock_report = reportID AND id_book = bookID;
    END WHILE;

END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER AfterInsertStockReceiptDetails
AFTER INSERT ON stock_receipts_details
FOR EACH ROW
BEGIN
    CALL CreateOrUpdateStockReportDetail(
        MONTH((SELECT receipt_date FROM stock_receipts WHERE id_stock_receipt = NEW.id_stock_receipt)),
        YEAR((SELECT receipt_date FROM stock_receipts WHERE id_stock_receipt = NEW.id_stock_receipt)),
        NEW.id_book,
        NEW.quantity
    );
END $$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER AfterInsertInvoiceDetailsForStock
AFTER INSERT ON invoices_details
FOR EACH ROW
BEGIN
    CALL CreateOrUpdateStockReportDetail(
        MONTH((SELECT invoices_date FROM invoices WHERE id_invoice = NEW.id_invoice)),
        YEAR((SELECT invoices_date FROM invoices WHERE id_invoice = NEW.id_invoice)),
        NEW.id_book,
        -NEW.quantity
    );
END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER AfterUpdateStockReceiptDetails
AFTER UPDATE ON stock_receipts_details
FOR EACH ROW
BEGIN
    CALL CreateOrUpdateStockReportDetail(
        MONTH((SELECT receipt_date FROM stock_receipts WHERE id_stock_receipt = NEW.id_stock_receipt)),
        YEAR((SELECT receipt_date FROM stock_receipts WHERE id_stock_receipt = NEW.id_stock_receipt)),
        NEW.id_book,
        NEW.quantity - OLD.quantity
    );
END $$

DELIMITER ;





DELIMITER $$

CREATE TRIGGER AfterDeleteStockReceiptDetails
AFTER DELETE ON stock_receipts_details
FOR EACH ROW
BEGIN
    CALL CreateOrUpdateStockReportDetail(
        MONTH((SELECT receipt_date FROM stock_receipts WHERE id_stock_receipt = OLD.id_stock_receipt)),
        YEAR((SELECT receipt_date FROM stock_receipts WHERE id_stock_receipt = OLD.id_stock_receipt)),
        OLD.id_book,
        -OLD.quantity
    );
END $$

DELIMITER ;





DELIMITER $$

CREATE TRIGGER AfterDeleteStockReceipt
AFTER DELETE ON stock_receipts
FOR EACH ROW
BEGIN
    -- Duyệt qua tất cả các chi tiết của phiếu nhập kho đã xóa
    DECLARE done INT DEFAULT 0;
    DECLARE v_id_book INT;
    DECLARE v_quantity INT;
    DECLARE cur CURSOR FOR 
        SELECT id_book, quantity 
        FROM stock_receipts_details 
        WHERE id_stock_receipt = OLD.id_stock_receipt;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO v_id_book, v_quantity;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Cập nhật báo cáo kho khi phiếu nhập hàng bị xóa
        CALL CreateOrUpdateStockReportDetail(
            MONTH(OLD.receipt_date),
            YEAR(OLD.receipt_date),
            v_id_book,
            -v_quantity
        );
    END LOOP;

    CLOSE cur;
END $$

DELIMITER ;


-- Insert data into books table
INSERT INTO books (title, category, author, quantity, price, slug) VALUES
('The Great Gatsby', 'Novel', 'F Scott Fitzgerald', 50, 10000.00, 'the-great-gatsby-novel-f-scott-fitzgerald'),
('To Kill a Mockingbird', 'Novel', 'Harper Lee', 30, 12000.00, 'to-kill-a-mockingbird-novel-harper-lee'),
('1984', 'Science Fiction', 'George Orwell', 40, 15000.00, '1984-science-fiction-george-orwell'),
('Pride and Prejudice', 'Novel', 'Jane Austen', 25, 11000.00, 'pride-and-prejudice-novel-jane-austen'),
('The Catcher in the Rye', 'Novel', 'JD Salinger', 35, 13000.00, 'the-catcher-in-the-rye-novel-jd-salinger'),
('The Hobbit', 'Fantasy', 'JRR Tolkien', 45, 14000.00, 'the-hobbit-fantasy-jrr-tolkien'),
('Fahrenheit 451', 'Science Fiction', 'Ray Bradbury', 20, 9000.00, 'fahrenheit-451-science-fiction-ray-bradbury'),
('Jane Eyre', 'Novel', 'Charlotte Bronte', 50, 10000.00, 'jane-eyre-novel-charlotte-bronte'),
('Animal Farm', 'Science Fiction', 'George Orwell', 30, 12000.00, 'animal-farm-science-fiction-george-orwell'),
('Moby-Dick', 'Novel', 'Herman Melville', 40, 15000.00, 'moby-dick-novel-herman-melville'),
('War and Peace', 'Novel', 'Leo Tolstoy', 25, 11000.00, 'war-and-peace-novel-leo-tolstoy'),
('The Odyssey', 'Novel', 'Homer', 35, 13000.00, 'the-odyssey-novel-homer'),
('Crime and Punishment', 'Novel', 'Fyodor Dostoevsky', 45, 14000.00, 'crime-and-punishment-novel-fyodor-dostoevsky'),
('The Brothers Karamazov', 'Novel', 'Fyodor Dostoevsky', 20, 9000.00, 'the-brothers-karamazov-novel-fyodor-dostoevsky'),
('Brave New World', 'Science Fiction', 'Aldous Huxley', 50, 10000.00, 'brave-new-world-science-fiction-aldous-huxley'),
('Wuthering Heights', 'Novel', 'Emily Bronte', 30, 12000.00, 'wuthering-heights-novel-emily-bronte'),
('The Iliad', 'Novel', 'Homer', 40, 15000.00, 'the-iliad-novel-homer'),
('Les Misérables', 'Novel', 'Victor Hugo', 25, 11000.00, 'les-miserables-novel-victor-hugo'),
('The Divine Comedy', 'Novel', 'Dante Alighieri', 35, 13000.00, 'the-divine-comedy-novel-dante-alighieri'),
('The Picture of Dorian Gray', 'Novel', 'Oscar Wilde', 45, 14000.00, 'the-picture-of-dorian-gray-novel-oscar-wilde'),
('The Count of Monte Cristo', 'Novel', 'Alexandre Dumas', 20, 9000.00, 'the-count-of-monte-cristo-novel-alexandre-dumas'),
('Dracula', 'Novel', 'Bram Stoker', 50, 10000.00, 'dracula-novel-bram-stoker'),
('The Adventures of Huckleberry Finn', 'Novel', 'Mark Twain', 30, 12000.00, 'the-adventures-of-huckleberry-finn-novel-mark-twain'),
('The Scarlet Letter', 'Novel', 'Nathaniel Hawthorne', 40, 15000.00, 'the-scarlet-letter-novel-nathaniel-hawthorne'),
('Frankenstein', 'Novel', 'Mary Shelley', 25, 11000.00, 'frankenstein-novel-mary-shelley'),
('The Lord of the Rings', 'Fantasy', 'JRR Tolkien', 35, 13000.00, 'the-lord-of-the-rings-fantasy-jrr-tolkien'),
('The Chronicles of Narnia', 'Fantasy', 'CS Lewis', 45, 14000.00, 'the-chronicles-of-narnia-fantasy-cs-lewis'),
('Harry Potter and the Sorcerers Stone', 'Fantasy', 'JK Rowling', 20, 9000.00, 'harry-potter-and-the-sorcerers-stone-fantasy-jk-rowling'),
('The Hunger Games', 'Science Fiction', 'Suzanne Collins', 50, 10000.00, 'the-hunger-games-science-fiction-suzanne-collins'),
('The Maze Runner', 'Science Fiction', 'James Dashner', 30, 12000.00, 'the-maze-runner-science-fiction-james-dashner'),
('Divergent', 'Science Fiction', 'Veronica Roth', 40, 15000.00, 'divergent-science-fiction-veronica-roth'),
('The Fault in Our Stars', 'Novel', 'John Green', 25, 11000.00, 'the-fault-in-our-stars-novel-john-green'),
('The Book Thief', 'Novel', 'Markus Zusak', 35, 13000.00, 'the-book-thief-novel-markus-zusak'),
('The Kite Runner', 'Novel', 'Khaled Hosseini', 45, 14000.00, 'the-kite-runner-novel-khaled-hosseini'),
('Life of Pi', 'Novel', 'Yann Martel', 20, 9000.00, 'life-of-pi-novel-yann-martel'),
('The Road', 'Novel', 'Cormac McCarthy', 50, 10000.00, 'the-road-novel-cormac-mccarthy'),
('The Girl with the Dragon Tattoo', 'Novel', 'Stieg Larsson', 30, 12000.00, 'the-girl-with-the-dragon-tattoo-novel-stieg-larsson'),
('Gone Girl', 'Novel', 'Gillian Flynn', 40, 15000.00, 'gone-girl-novel-gillian-flynn'),
('The Da Vinci Code', 'Novel', 'Dan Brown', 25, 11000.00, 'the-da-vinci-code-novel-dan-brown'),
('Angels and Demons', 'Novel', 'Dan Brown', 35, 13000.00, 'angels-and-demons-novel-dan-brown'),
('The Alchemist', 'Novel', 'Paulo Coelho', 45, 14000.00, 'the-alchemist-novel-paulo-coelho'),
('The Little Prince', 'Novel', 'Antoine de Saint-Exupery', 20, 9000.00, 'the-little-prince-novel-antoine-de-saint-exupery'),
('The Secret', 'Self Help', 'Rhonda Byrne', 50, 10000.00, 'the-secret-self-help-rhonda-byrne'),
('The Power of Now', 'Self Help', 'Eckhart Tolle', 30, 12000.00, 'the-power-of-now-self-help-eckhart-tolle'),
('The Art of War', 'Self Help', 'Sun Tzu', 40, 15000.00, 'the-art-of-war-self-help-sun-tzu'),
('The 7 Habits of Highly Effective People', 'Self Help', 'Stephen R Covey', 25, 11000.00, 'the-7-habits-of-highly-effective-people-self-help-stephen-r-covey'),
('How to Win Friends and Influence People', 'Self Help', 'Dale Carnegie', 35, 13000.00, 'how-to-win-friends-and-influence-people-self-help-dale-carnegie'),
('Think and Grow Rich', 'Self Help', 'Napoleon Hill', 45, 14000.00, 'think-and-grow-rich-self-help-napoleon-hill'),
('Rich Dad Poor Dad', 'Self Help', 'Robert Kiyosaki', 20, 9000.00, 'rich-dad-poor-dad-self-help-robert-kiyosaki'),
('The Lean Startup', 'Self Help', 'Eric Ries', 50, 10000.00, 'the-lean-startup-self-help-eric-ries');


-- Insert stock receipts for each month from December 2023 to December 2024
INSERT INTO stock_receipts (id_stock_receipt, receipt_date)
VALUES
('RC231201', '2023-12-01'),
('RC240101', '2024-01-01'),
('RC240201', '2024-02-01'),
('RC240301', '2024-03-01'),
('RC240401', '2024-04-01'),
('RC240501', '2024-05-01'),
('RC240601', '2024-06-01'),
('RC240701', '2024-07-01'),
('RC240801', '2024-08-01'),
('RC240901', '2024-09-01'),
('RC241001', '2024-10-01'),
('RC241101', '2024-11-01'),
('RC241201', '2024-12-01');

-- Insert stock receipt details, assigning 4 books per month
INSERT INTO stock_receipts_details (id_stock_receipt, id_book, quantity)
VALUES
-- December 2023
('RC231201', 1, 50),
('RC231201', 2, 30),
('RC231201', 3, 40),
('RC231201', 4, 25),
-- January 2024
('RC240101', 5, 35),
('RC240101', 6, 45),
('RC240101', 7, 20),
('RC240101', 8, 50),
-- February 2024
('RC240201', 9, 30),
('RC240201', 10, 40),
('RC240201', 11, 25),
('RC240201', 12, 35),
-- March 2024
('RC240301', 13, 45),
('RC240301', 14, 20),
('RC240301', 15, 50),
('RC240301', 16, 30),
-- April 2024
('RC240401', 17, 40),
('RC240401', 18, 25),
('RC240401', 19, 35),
('RC240401', 20, 45),
-- May 2024
('RC240501', 21, 20),
('RC240501', 22, 50),
('RC240501', 23, 30),
('RC240501', 24, 40),
-- June 2024
('RC240601', 25, 25),
('RC240601', 26, 35),
('RC240601', 27, 45),
('RC240601', 28, 20),
-- July 2024
('RC240701', 29, 50),
('RC240701', 30, 30),
('RC240701', 31, 40),
('RC240701', 32, 25),
-- August 2024
('RC240801', 33, 35),
('RC240801', 34, 45),
('RC240801', 35, 20),
('RC240801', 36, 50),
-- September 2024
('RC240901', 37, 30),
('RC240901', 38, 40),
('RC240901', 39, 25),
('RC240901', 40, 35),
-- October 2024
('RC241001', 41, 45),
('RC241001', 42, 20),
('RC241001', 43, 50),
('RC241001', 44, 30),
-- November 2024
('RC241101', 45, 40),
('RC241101', 46, 25),
('RC241101', 47, 35),
('RC241101', 48, 45),
-- December 2024
('RC241201', 49, 20),
('RC241201', 50, 50);



DELIMITER $$

CREATE TRIGGER after_insert_books
AFTER INSERT ON books
FOR EACH ROW
BEGIN
    -- Tìm phiếu nhập hàng của ngày hiện tại hoặc tạo mới nếu chưa tồn tại
    IF NOT EXISTS (
        SELECT 1
        FROM stock_receipts
        WHERE receipt_date = CURDATE()
    ) THEN
        INSERT INTO stock_receipts (id_stock_receipt, receipt_date)
        VALUES (
            CONCAT('RC', DATE_FORMAT(CURDATE(), '%y%m%d')),
            CURDATE()
        );
    END IF;

    -- Lấy ID phiếu nhập hàng hiện tại
    SET @receipt_id = (
        SELECT id_stock_receipt
        FROM stock_receipts
        WHERE receipt_date = CURDATE()
        LIMIT 1
    );

    -- Thêm hoặc cập nhật chi tiết phiếu nhập hàng
    IF EXISTS (
        SELECT 1
        FROM stock_receipts_details
        WHERE id_stock_receipt = @receipt_id AND id_book = NEW.id_book
    ) THEN
        -- Nếu đã có trong chi tiết, chỉ cần cập nhật số lượng
        UPDATE stock_receipts_details
        SET quantity = quantity + NEW.quantity
        WHERE id_stock_receipt = @receipt_id AND id_book = NEW.id_book;
    ELSE
        -- Nếu chưa có, thêm chi tiết nhập hàng
        INSERT INTO stock_receipts_details (id_stock_receipt, id_book, quantity)
        VALUES (@receipt_id, NEW.id_book, NEW.quantity);
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_update_books
AFTER UPDATE ON books
FOR EACH ROW
BEGIN
    -- Kiểm tra nếu số lượng sách mới lớn hơn số lượng sách cũ
    IF NEW.quantity > OLD.quantity THEN
        -- Tính số lượng thêm vào
        SET @quantity_added = NEW.quantity - OLD.quantity;

        -- Tìm phiếu nhập hàng của ngày hiện tại hoặc tạo mới nếu chưa tồn tại
        IF NOT EXISTS (
            SELECT 1
            FROM stock_receipts
            WHERE receipt_date = CURDATE()
        ) THEN
            INSERT INTO stock_receipts (id_stock_receipt, receipt_date)
            VALUES (
                CONCAT('RC', DATE_FORMAT(CURDATE(), '%y%m%d')),
                CURDATE()
            );
        END IF;

        -- Lấy ID phiếu nhập hàng hiện tại
        SET @receipt_id = (
            SELECT id_stock_receipt
            FROM stock_receipts
            WHERE receipt_date = CURDATE()
            LIMIT 1
        );

        -- Thêm hoặc cập nhật chi tiết phiếu nhập hàng
        IF EXISTS (
            SELECT 1
            FROM stock_receipts_details
            WHERE id_stock_receipt = @receipt_id AND id_book = NEW.id_book
        ) THEN
            -- Nếu đã có trong chi tiết, chỉ cần cập nhật số lượng
            UPDATE stock_receipts_details
            SET quantity = quantity + @quantity_added
            WHERE id_stock_receipt = @receipt_id AND id_book = NEW.id_book;
        ELSE
            -- Nếu chưa có, thêm chi tiết nhập hàng
            INSERT INTO stock_receipts_details (id_stock_receipt, id_book, quantity)
            VALUES (@receipt_id, NEW.id_book, @quantity_added);
        END IF;
    END IF;
END$$

DELIMITER ;








-- Insert data into customers table
INSERT INTO customers (full_name, address, phone, email) VALUES
('Nguyen Van A', 'Hanoi', '0123456789', 'a@gmail.com'),
('Tran Thi B', 'Ho Chi Minh City', '0987654321', 'b@gmail.com'),
('Le Van C', 'Da Nang', '0112233445', 'c@gmail.com');



-- Insert data into invoices table
INSERT INTO invoices (id_invoice, id_customer, invoices_DATE) VALUES
('INV001', 1, '2024-02-20'),
('INV002', 2, '2024-02-25'),
('INV003', 2, '2024-03-25'),
('INV004', 1, '2024-03-25');

-- Insert data into invoices_details table
INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES
('INV001', 2, 2, 12000.00),
('INV002', 3, 5, 15000.00),
('INV003', 1, 1, 10000.00);

-- Insert data into payment_receipts table
INSERT INTO payment_receipts (id_payment_receipt, id_customer, payment_date, amount_received) VALUES
('PR001', 1, '2024-02-21', 15000.00),
('PR002', 2, '2024-02-26', 20000.00),
('PR003', 1, '2024-03-21', 10000.00);

INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES
('INV004', 1, 3, 10000.00);

UPDATE books SET quantity = 46 WHERE id_book = 1;
UPDATE books SET quantity = 28 WHERE id_book = 2;
UPDATE books SET quantity = 35 WHERE id_book = 3;

INSERT INTO rules (rule_name, rule_value, description) VALUES 
('minImportQuantity', '150', 'Số lượng nhập tối thiểu'),
('minStockQuantityBeforeImport', '300', 'Lượng tồn tối thiểu trước khi nhập'),
('maxDebt', '200000', 'Tiền nợ tối đa'),
('minStockAfterSale', '20', 'Lượng tồn tối thiểu sau khi bán'),
('allowOverpayment', 'true', 'Số tiền thu không vƣợt quá số tiền khách hàng đang nợ');

-- INSERT INTO invoices_details (id_invoice, id_book, quantity, unit_price) VALUES
-- ('INV003', 1, 1, 150.00);

use book_management;
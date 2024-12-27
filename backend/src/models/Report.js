const connection = require("../config/database");

const getAllDebtReport = (callback) => {
  connection.query(
    `SELECT dr.id_debt_report, dr.report_month, dr.report_year, drd.id_customer, drd.initial_debt, drd.changes, drd.final_debt 
                      FROM debt_reports dr JOIN debt_reports_details drd 
                      ON dr.id_debt_report = drd.id_debt_report`,
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const isDebtReportExist = (month, year, callback) => {
  connection.query(
    `SELECT * FROM debt_reports WHERE report_month = ? AND report_year = ?`,
    [month, year],
    (error, results) => {
      if (error) {
      //  console.log("lỗi1");
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const getDebtReport = (month, year, callback) => {
  // Check if the debt report for the given month and year exists
  isDebtReportExist(month, year, (error, results) => {
    if (error) {
      return callback(error, null);
    }

    if (results.length === 0) {
      // Insert a new debt report if it does not exist
      const insertQuery = `
                INSERT INTO debt_reports (id_debt_report, report_month, report_year)
                SELECT CONCAT('DR', LPAD(COUNT(*) + 1, 4, '0')), ?, ?
                FROM debt_reports;
            `;
      connection.query(
        insertQuery,
        [month, year],
        (insertError, insertResults) => {
          if (insertError) {
            return callback(insertError, null);
          }

          // After inserting, fetch the new debt report data
          getDebtReport(month, year, callback);
        }
      );
    } else {
      // If the report exists, retrieve the data
      const sqlQuery = `
                WITH LastKnownDebts AS (
                SELECT
                    drd.id_customer,
                    drd.final_debt AS last_final_debt,
                    ROW_NUMBER() OVER (
                        PARTITION BY drd.id_customer
                        ORDER BY dr.report_year DESC, dr.report_month DESC
                    ) AS row_num
                FROM debt_reports_details drd
                JOIN debt_reports dr ON dr.id_debt_report = drd.id_debt_report   
                WHERE dr.report_year < ? OR (dr.report_year = ? AND dr.report_month < ?)
            ),
            CurrentDebts AS (
                SELECT
                    dr.id_debt_report,
                    dr.report_month,
                    dr.report_year,
                    drd.id_customer,
                    drd.initial_debt,
                    drd.changes,
                    drd.final_debt
                FROM debt_reports_details drd
                JOIN debt_reports dr ON dr.id_debt_report = drd.id_debt_report
                WHERE dr.report_month = ? AND dr.report_year = ?
            ),
            AllCustomers AS (
                SELECT id_customer FROM CurrentDebts
                UNION
                SELECT id_customer FROM LastKnownDebts
            )
            SELECT
                COALESCE(cd.id_debt_report, dr.id_debt_report) AS id_debt_report,
                dr.report_month,
                dr.report_year,
                ac.id_customer,
                c.full_name,
                COALESCE(cd.initial_debt, lkd.last_final_debt) AS initial_debt,
                COALESCE(cd.changes, 0.00) AS changes,
                COALESCE(cd.final_debt, COALESCE(lkd.last_final_debt, 0.00)) AS final_debt
            FROM AllCustomers ac
            LEFT JOIN CurrentDebts cd ON ac.id_customer = cd.id_customer
            JOIN customers c ON c.id_customer = ac.id_customer
            LEFT JOIN (
                SELECT id_customer, last_final_debt
                FROM LastKnownDebts
                WHERE row_num = 1
            ) lkd ON ac.id_customer = lkd.id_customer
            LEFT JOIN debt_reports dr ON dr.report_month = ? AND dr.report_year = ?;
            `;

      // Execute the query
      connection.query(
        sqlQuery,
        [year, year, month, month, year, month, year],
        (queryError, queryResults) => {
          if (queryError) {
            return callback(queryError, null);
          }
          callback(null, queryResults);
        }
      );
    }
  });
};

// Stock

const getAllStockReport = (callback) => {
  connection.query(
    `SELECT sr.id_stock_report, sr.report_month, sr.report_year, srd.id_book, srd.initial_stock, srd.changes, srd.final_stock
                        FROM stock_reports sr JOIN stock_reports_details srd 
                        ON sr.id_stock_report = srd.id_stock_report`,
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const isStockReportExist = (month, year, callback) => {
  connection.query(
    `SELECT * FROM stock_reports WHERE report_month = ? AND report_year = ?`,
    [month, year],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const getStockReport = (month, year, callback) => {
  // Kiểm tra xem báo cáo kho cho tháng và năm đã tồn tại chưa
  isStockReportExist(month, year, (error, results) => {
    if (error) {
      return callback(error, null);
    }

    if (results.length === 0) {
      // Nếu báo cáo chưa tồn tại, thêm báo cáo mới
      const insertQuery = `
                  INSERT INTO stock_reports (id_stock_report, report_month, report_year)
                  SELECT CONCAT('SR', LPAD(COUNT(*) + 1, 4, '0')), ?, ?
                  FROM stock_reports;
              `;
      connection.query(
        insertQuery,
        [month, year],
        (insertError, insertResults) => {
          if (insertError) {
            return callback(insertError, null);
          }

          // Sau khi thêm báo cáo mới, lấy dữ liệu báo cáo
          getStockReport(month, year, callback);
        }
      );
    } else {
      // Nếu báo cáo tồn tại, lấy dữ liệu báo cáo
      const sqlQuery = `
                  WITH LastKnownStocks AS (
                  SELECT
                      srd.id_book,
                      srd.final_stock AS last_final_stock,
                      ROW_NUMBER() OVER (
                          PARTITION BY srd.id_book
                          ORDER BY sr.report_year DESC, sr.report_month DESC
                      ) AS row_num
                  FROM stock_reports_details srd
                  JOIN stock_reports sr ON sr.id_stock_report = srd.id_stock_report
                  WHERE sr.report_year < ? OR (sr.report_year = ? AND sr.report_month < ?)
              ),
              CurrentStocks AS (
                  SELECT
                      sr.id_stock_report,
                      sr.report_month,
                      sr.report_year,
                      srd.id_book,
                      srd.initial_stock,
                      srd.changes,
                      srd.final_stock
                  FROM stock_reports_details srd
                  JOIN stock_reports sr ON sr.id_stock_report = srd.id_stock_report
                  WHERE sr.report_month = ? AND sr.report_year = ?
              ),
              AllBooks AS (
                  SELECT id_book FROM CurrentStocks
                  UNION
                  SELECT id_book FROM LastKnownStocks
              )
              SELECT
                  COALESCE(cs.id_stock_report, sr.id_stock_report) AS id_stock_report,
                  sr.report_month,
                  sr.report_year,
                  ab.id_book,
                  b.title,
                  b.author,
                  COALESCE(cs.initial_stock, lks.last_final_stock) AS initial_stock,
                  COALESCE(cs.changes, 0.00) AS changes,
                  COALESCE(cs.final_stock, COALESCE(lks.last_final_stock, 0.00)) AS final_stock
              FROM AllBooks ab
              LEFT JOIN CurrentStocks cs ON ab.id_book = cs.id_book
              JOIN books b ON b.id_book = ab.id_book
              LEFT JOIN (
                  SELECT id_book, last_final_stock
                  FROM LastKnownStocks
                  WHERE row_num = 1
              ) lks ON ab.id_book = lks.id_book
              LEFT JOIN stock_reports sr ON sr.report_month = ? AND sr.report_year = ?;
              `;

      // Thực thi câu truy vấn
      connection.query(
        sqlQuery,
        [year, year, month, month, year, month, year],
        (queryError, queryResults) => {
          if (queryError) {
            return callback(queryError, null);
          }
          callback(null, queryResults);
        }
      );
    }
  });
};

module.exports = {
  getAllDebtReport,
  getDebtReport,
  getAllStockReport,
  getStockReport,
};

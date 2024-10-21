# Frontend

# Backend

1. API Book: /api/books

- PUT: /update  
  - Cập nhật danh sách các quyển sách, với mỗi quyển sách: nếu đã tồn tại, nếu không thì sẽ thêm mới
  - Nếu có quyển sách trong mảng bị lỗi sẽ trả về mảng các quyển sách bị lỗi khi thêm
  - body: [{title1, author1, category1, quantity1, price1},{title2, author2,...}, ... ]
- GET: /stocks/report ->
  - query: {month, year}
- GET: /search -> Tìm kiếm sách theo bất kì trường nào
  - query: {title, author, category:, price}
- GET: /total/price ->
  - body:

2. API Customer: /api/customer

- GET: /report/debt ->
  - query: {month, year}

3. API Rule
   PUT: /api/rules
   body {
   minImportQuantity: 200,
   minStockQuantityBeforeImport: 200,
   maxDebt: 30000,
   minStockAfterSale: 30,
   maxDebtCollection: false
   }

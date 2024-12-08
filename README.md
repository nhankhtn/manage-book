# Frontend

# Backend

1. API Book: /api/books

- PUT: /
  - Cập nhật danh sách các quyển sách, với mỗi quyển sách: nếu đã tồn tại, nếu không thì sẽ thêm mới
  - Nếu có quyển sách trong mảng bị lỗi sẽ trả về mảng các quyển sách bị lỗi khi thêm
  - body: [{title1, author1, category1, quantity1, price1},{title2, author2,...}, ... ]
- GET: /stocks/report ->
  - query: {month, year}
- GET: /search -> Tìm kiếm sách theo bất kì trường nào
  - query: {title, author, category, price}
- GET: /total/price ->
  - body:
  - total price
  - request body: title, author, category, available, price, quantity
  - books sẽ lấy chính xác dữ liệu từ request body, nơi mà mình đã sử dụng getBooks để lấy dữ liệu sách từ server, vì thế nếu test trên
  - postman phải ghi đúng {key: value} của request body, do sau mỗi lần test thì nó sẽ trừ quantity đi 1 lượng needbuying
  - request body:
  - [
  -     {
  -         "title": "Những con chó biết sủa",
  -         "author": "Nguyễn Hữu Khánh Nhân",
  -         "category": "Truyện hài",
  -         "quantity": 110,
  -         "price": 19.99,
  -         "needbuying": 1
  -     },
  -     {
  -         "title": "Thần dâm",
  -         "author": "Nguyễn Đình Minh nhật?",
  -         "category": "Tiểu thuyết",
  -         "quantity": 101,
  -         "price": 19.99,
  -         "needbuying": 3
  -     }
  - ]

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
   allowOverpayment: false
   }

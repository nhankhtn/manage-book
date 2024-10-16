# Frontend

# Backend

1. API Book: /api/books

- PUT: /update -> Cập nhập sách nếu đã tồn tại, nếu không thì sẽ thêm mới
  - body: {title, author, category:, quantity, price}
- GET: /stocks/report ->
  - query: {month, year}
- GET: /search -> Tìm kiếm sách theo bất kì trường nào
  - query: {title, author, category:, price}
- GET: /total/price ->
  - body:

2. API Customer: /api/customer

- GET: /report/debt ->
  - query: {month, year}

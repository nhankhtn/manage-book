const Book = require('../services/bookService');

const getBooks = (req, res) => {
    Book.getAllBooks((err, books) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve books' });
        }
        res.json(books);
    });
};


// total price
// request body: title, author, category, available, price, quantity
// books sẽ lấy chính xác dữ liệu từ request body, nơi mà mình đã sử dụng getBooks để lấy dữ liệu sách từ server, vì thế nếu test trên
// postman phải ghi đúng {key: value} của request body, do sau mỗi lần test thì nó sẽ trừ quantity đi 1 lượng needbuying
// request body: 
// [
//     {
//         "title": "Những con chó biết sủa",
//         "author": "Nguyễn Hữu Khánh Nhân",
//         "category": "Truyện hài",
//         "quantity": 110,
//         "price": 19.99,
//         "needbuying": 1
//     },
//     {
//         "title": "Thần dâm",
//         "author": "Nguyễn Đình Minh nhật",
//         "category": "Tiểu thuyết",
//         "quantity": 101,
//         "price": 19.99,
//         "needbuying": 3
//     }
// ]

const totalPrice = (req, res) => {
    console.log('Request received at totalPrice endpoint');
    const books = req.body;
    let totalAmount = 0;
    let processedBooks = [];
    const processBook = (index) => {
        if (index >= books.length) {
            console.log('Processed Books:', processedBooks);
            return res.json({ books: processedBooks, total: totalAmount });
        }

        const { title, author, category, quantity, price, needbuying } = books[index];
        console.log(`Processing book: ${title}`);
        Book.total(title, author, category, quantity, price, needbuying, (err, book) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi khi tìm sách' });
            }
            if (!book) {
                res.status(404).json({ message: `Không tìm thấy dữ liệu phù hợp:` });
            }

            totalAmount += book.price * needbuying;
            processedBooks.push({ title, author, category, needbuying, price });
            processBook(index + 1);
        });
    };
    processBook(0);
};


// update and add book // Nghĩ lại cách nhập sách cho trường hợp này
// 1. Nếu sách đã tồn tại và mình muốn update sách thì mình chỉ cần nhập tên sách và số lượng cần nhập thôi không cần full
// 2. Nếu sách chưa tồn tại thì mình cần nhập đầy đủ thông tin sách
// Hoặc lúc đầu mình chỉ nhập tên sách và số lượng để tìm kiếm nếu sách đã tồn tại thì mình chỉ cần nhập số lượng còn không thì mình cần nhập đầy đủ thông tin
const importBooks = (req, res) => {
    const { title, author, category, quantity, price } = req.body;
    
    Book.checkStock(title, (err, book) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi kiểm tra số lượng tồn' });
        }
        
        if (!book) {
            if ( !author || !category || !price || !quantity) {
                return res.status(400).json({ error: 'Sách không tồn tại. Nếu bạn muốn thêm sách vui lòng nhập đầy đủ thông tin.' });
            }
            
            const newBook = {
                title: title,
                author: author,
                category: category,
                price: price,
                quantity: quantity
            };
            
            Book.addBook(newBook, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                return res.status(200).json({ message: 'Nhập sách thành công', newStock: quantity });
            });
        } else {
            let currentStock = book.quantity;
            if(!currentStock)
            {
                currentStock = 0;
            }
            Book.updateStock(title, quantity, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(200).json({ message: 'Nhập sách thành công', newStock: currentStock + quantity });
            });
        }
    });
};


// REPORT STOCK
const reportStock = (req, res) => {
    const { month, year } = req.body;
    Book.getStock(month, year, (err, book) => {
        if (err) {
            return res.status(500).json({ error: 'Lấy dữ liệu thất bại' });
        }
        if(!book)
        {
            return res.status(404).json({ message: 'Tháng này không có lượng tồn' });
        }
        res.json(book);
    });
};


// LOOKUP BOOK

const searchBooks = (req, res) => {
    const { title, author, category, price } = req.body;
    Book.search(title, author, category, price, (err, book) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi tìm sách' });
        }
        if(!book)
        {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }
        res.json(book);
    });
};



module.exports = {
    getBooks,
    importBooks,
    reportStock,
    searchBooks,
    totalPrice
};
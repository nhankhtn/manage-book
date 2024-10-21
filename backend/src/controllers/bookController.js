const bookService = require('../services/bookService');
const Book = require("../models/Book")

const getBooks = (req, res) => {
    Book.getBooks((err, books) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve books' });
        }
        res.json({ data: books });
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
//         "author": "Nguyễn Đình Minh nhật?",
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


const updateBooks = async (req, res) => {
    const books = req.body;
    let resultAdd = [];
    let failedBooks = [];
    try {
        resultAdd = await Promise.all(
            books.map((book) => {
                return new Promise((resolve, reject) => {
                    bookService.importBook(book, (err, result) => {
                        if (err) {
                            failedBooks.push(book);
                            return reject(err);
                        }
                        resolve(result.book);
                    });
                });
            })
        );
        res.status(200).json({ data: resultAdd });
    } catch (error) {
      //  console.error('Error importing books:', error);
        res.status(500).json({ 
            error: 'Failed to import some or all books', 
            failedBooks,
        });
    }
};


// REPORT STOCK
const reportStock = (req, res) => {
    const { month, year } = req.query;
    Book.getStock(month, year, (err, book) => {
        if (!book) {
            return res.status(404).json({ message: 'Tháng này không có lượng tồn' });
        }
        res.json(book);
    });
};


// LOOKUP BOOK
const searchBooks = (req, res) => {
    const { title, author, category, price } = req.query;
    console.log('request received at searchBooks endpoint');
    console.log(req.query);
    bookService.search(title, author, category, price, (err, books) => {
        if (err) return res.status(500).json({ message: "Lỗi khi tìm sách" });
        if (!books.length) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }
        res.status(200).json({ data: books });
    });
};

const deleteBooks = (req, res) => {
    const { title } = req.query;
    bookService.deleteBook(title, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi xóa sách" });
        res.json(result);
    });
} 



module.exports = {
    getBooks,
    updateBooks,
    reportStock,
    searchBooks,
    totalPrice
};
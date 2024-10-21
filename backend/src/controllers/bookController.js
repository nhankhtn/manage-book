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
// const updateBook =  async (req, res) => {
//     const books = req.body;
//     var hasError = false;
//     var resultAdd = [];
//     await books.forEach( async (book) => {
//         await bookService.importBooks(book, (err, result) => {
//             if (err) {
//                 //return res.status(err.statusCode || 500).json({ error: err.message });
//                 hasError = true;
//                 console.log('Failed to import book:', err.message);
//             }

//             console.log('Imported book:', result.message);
//             console.log('Book:', result.book);
//             resultAdd.push(result.book);   

//         });
//     });
//     if (hasError) {
//         return res.status(500).json({ error: 'Failed to import books' });
//     }
//     console.log(resultAdd)
//     res.status(200).json({data: resultAdd });
 
// };

const updateBook = async (req, res) => {
    const books = req.body;
    let hasError = false;
    let resultAdd = [];

    try {
        resultAdd = await Promise.all(
            books.map((book) => {
                return new Promise((resolve, reject) => {
                    bookService.importBooks(book, (err, result) => {
                        if (err) {
                            hasError = true;
                            console.log('Failed to import book:', err.message);
                            return reject(err);
                        }

                        // console.log('Imported book:', result.message);
                        // console.log('Book:', result.book);
                        resolve(result.book);
                    });
                });
            })
        );

        if (hasError) {
            return res.status(500).json({ error: 'Failed to import some or all books' });
        }

        res.status(200).json({ data: resultAdd });
    } catch (error) {
        console.error('Error importing books:', error);
        res.status(500).json({ error: 'Failed to import some or all books' });
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
    updateBook,
    reportStock,
    searchBooks,
    totalPrice
};
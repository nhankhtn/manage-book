describe('Book Search Test', () => {
    it('should search for a book unsuccessfully', () => {
        cy.fixture('users').then((user) => {
            cy.visit('http://localhost:3000/auth/login');
            cy.get('input[name="username"]').type(user.username);
            cy.get('input[name="password"]').type(user.password);
            cy.get('button[type="submit"]').click();

            cy.url().should('include', '/dashboard');

            // Click vào nút chuyển trang book-search
            cy.get('a[href="/dashboard/book-search"]').click();

            cy.url().should('include', '/dashboard/book-search');

            const book = {
                title: "The Alchemist",
                author: "F. Scott Fitzgerald",
                category: "Fiction",
                price: 10.99
            };

            cy.get('input[name="title"]').type(book.title);
            cy.get('input[name="author"]').type(book.author);
            cy.get('input[name="category"]').type(book.category);
            cy.get('input[name="price"]').type(book.price);

            cy.get('button').contains('Tra cứu').click();

            // Kiểm tra kết quả tìm kiếm
            cy.get('table').then(($table) => {
                const titleExists = $table.find('td:contains("' + book.title + '")').length > 0;
                const authorExists = $table.find('td:contains("' + book.author + '")').length > 0;
                const categoryExists = $table.find('td:contains("' + book.category + '")').length > 0;
                const priceExists = $table.find('td:contains("' + book.price + '")').length > 0;

                if (titleExists && authorExists && categoryExists && priceExists) {
                    cy.log('Đã tìm thấy sách');
                } else {
                    cy.log('Không tìm thấy sách thỏa các trường đã nhập');
                }
            });
        });
    });
});
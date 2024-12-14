describe('Book Import Test', () => {
    it('should submit the book import form successfully', () => {
        cy.fixture('users').then((user) => {
            cy.visit('http://localhost:3000/auth/login');
            cy.get('input[name="username"]').type(user.username);
            cy.get('input[name="password"]').type(user.password);
            cy.get('button[type="submit"]').click();

            cy.url().should('include', '/dashboard/book-import');

            cy.get('button').contains('Thêm sách').click();

            const minStockQuantityBeforeImport = 40;

            cy.fixture('books').then((books) => {
                books.forEach(book => {
                    // Điền thông tin sách vào form thêm sách
                    cy.get('input#title').type(book.title);
                    cy.get('input#author').type(book.author);
                    cy.get('input#category').type(book.category);
                    cy.get('input#quantity').type(book.quantity);
                    cy.get('input#price').type(book.price);
                    // Thực hiện submit form thêm sách
                    cy.get('#btn-form-add-book').click();

                    if (parseInt(book.quantity) < minStockQuantityBeforeImport) {
                        cy.get('.error').should('be.visible').and('contain', `Số lượng sách phải từ ${minStockQuantityBeforeImport} trở lên`);
                    } else {
                        cy.get('table').contains(book.title);
                    }
                });
            })
        });
    });
});

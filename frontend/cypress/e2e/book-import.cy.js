describe('Book Import Test', () => {
    it('should submit the book import form successfully', () => {
        cy.fixture('users').then((user) => {
            cy.visit('http://localhost:3000/auth/login');
            cy.get('input[name="username"]').type(user.username);
            cy.get('input[name="password"]').type(user.password);
            cy.get('button[type="submit"]').click();

            cy.url().should('include', '/dashboard/book-import');

            // Giả lập nhập liệu vào form và gửi
            cy.get('input[name="bookTitle"]').type('New Book Title');
            cy.get('input[name="author"]').type('Book Author');
            cy.get('button[type="submit"]').click();

            // Kiểm tra thông báo thành công
            cy.get('.alert-success').should('be.visible');
        });
    });
});

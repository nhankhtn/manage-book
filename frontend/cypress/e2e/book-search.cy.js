describe('Book Search Test', () => {
    it('should search for a book successfully', () => {
        cy.fixture('users').then((user) => {
            cy.visit('http://localhost:3000/auth/login');
            cy.get('input[name="username"]').type(user.username);
            cy.get('input[name="password"]').type(user.password);
            cy.get('button[type="submit"]').click();

            cy.url().should('include', '/dashboard/book-search');

            cy.get('input[name="title"]').type('The Great Gatsby');
            cy.get('button').contains('Tìm kiếm').click();

            // Kiểm tra kết quả tìm kiếm
            cy.get('.table').should('contain', 'The Great Gatsby');
        });
    });
});
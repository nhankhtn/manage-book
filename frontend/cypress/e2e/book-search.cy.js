describe('Book Search Test', () => {
    it('should search for a book successfully', () => {
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
                title: "The Alchemist"
            };

            cy.get('input[name="title"]').type(book.title);
            cy.get('button').contains('Tra cứu').click();

            // Kiểm tra kết quả tìm kiếm
            cy.get('table').then(($table) => {
                if ($table.find('td:contains(' + book.title + ')').length > 0) {
                    cy.log('Đã tìm thấy sách');
                } else {
                    cy.log('Không tìm thấy sách');
                }
            });
        });
    });
});
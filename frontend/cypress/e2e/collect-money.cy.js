describe('Collect Money Test', () => {
    it('should collect money from a customer successfully', () => {
        cy.fixture('users').then((user) => {
            cy.visit('http://localhost:3000/auth/login');
            cy.get('input[name="username"]').type(user.username);
            cy.get('input[name="password"]').type(user.password);
            cy.get('button[type="submit"]').click();

            cy.url().should('include', '/dashboard');

            // Click vào nút chuyển trang book-search
            cy.get('a[href="/dashboard/collect-money"]').click();

            cy.url().should('include', '/dashboard/collect-money');

            const customer = {
                name: "Nguyen Van A",
                phone_num: "0123456789",
                debt: 10000
            };

            cy.get('input[name="name"]').type(customer.name);
            cy.get('input[name="phone"]').type(customer.phone_num);
            cy.get('input[name="money-collected"]').clear().type(customer.debt);
            cy.get('button').contains('In phiếu').click();
        });
    });
});
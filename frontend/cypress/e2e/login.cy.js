describe('Login Test', () => {
  it('should log in with mock data', () => {
    cy.fixture('users').then((user) => {
      cy.visit('http://localhost:3000/auth/login');
      cy.get('input[name="username"]').type(user.username);
      cy.get('input[name="password"]').type(user.password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard/book-import');
    });
  });
});
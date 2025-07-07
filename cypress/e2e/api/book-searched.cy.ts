describe('Autenticación Auth0 y Obtención de Perfil', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('click al boton de explorar biblioteca', () => {
    cy.get('#explorar-biblioteca-button').should('be.visible').click();
    cy.get('#textfield-test', { timeout: 10000 })
      .should('be.visible')
      .type('El camino de los reyes');
    cy.get('a[href="/books/386446"]').click();
    cy.get('h4').first().should('contain.text', 'The Way of Kings');
  });
});

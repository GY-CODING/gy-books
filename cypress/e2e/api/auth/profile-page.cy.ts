describe('Autenticación y carga de perfil desde /profile', () => {
  beforeEach(() => {
    cy.session('auth0-login', () => {
      cy.visit('http://localhost:3000');
      cy.contains('button', 'Iniciar Sesión').click();

      cy.origin('https://gycoding.eu.auth0.com', () => {
        cy.get('input[name="username"], input[name="email"]', {
          timeout: 10000,
        })
          .should('be.visible')
          .type(Cypress.env('AUTH0_USERNAME'));
        cy.contains('button', 'Continuar').click();

        cy.get('input[name="password"]', { timeout: 10000 })
          .should('be.visible')
          .type(Cypress.env('AUTH0_PASSWORD'));
        cy.contains('button', 'Continuar').click();
      });

      cy.url({ timeout: 15000 }).should('include', 'localhost:3000');
      cy.contains('Buscar Amigos').should('be.visible');
    });
  });

  it('debería mostrar el perfil del usuario en /profile', () => {
    cy.visit('http://localhost:3000/profile');

    cy.get('#profile-username', { timeout: 10000 }).should('be.visible');
    cy.contains('gycoding-test');
  });
});

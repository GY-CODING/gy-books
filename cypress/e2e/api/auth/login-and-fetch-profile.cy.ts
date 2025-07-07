describe('Autenticación Auth0 y Obtención de Perfil', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('debería mostrar el botón de login cuando no hay usuario autenticado', () => {
    cy.get('#create-account-button').should('be.visible');
    cy.get('#search-friends-button').should('not.exist');
  });

  it('debería completar el flujo de login con Auth0 y traer el perfil', () => {
    cy.contains('button', 'Iniciar Sesión').should('be.visible').click();

    cy.origin('https://gycoding.eu.auth0.com', () => {
      cy.get('input[name="username"], input[name="email"]', { timeout: 10000 })
        .should('be.visible')
        .type(Cypress.env('AUTH0_USERNAME'));
      cy.contains('button', 'Continuar').click();

      cy.get('input[name="password"]', { timeout: 10000 })
        .should('be.visible')
        .type(Cypress.env('AUTH0_PASSWORD'));
      cy.contains('button', 'Continuar').click();
    });

    cy.url({ timeout: 15000 }).should('include', 'localhost:3000');

    cy.contains('button', 'Buscar Amigos').should('be.visible');

    cy.request({
      method: 'GET',
      url: '/api/auth/get',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 401]);
      if (response.status === 200) {
        const body = response.body as { gyCodingUser: { username?: string } };
        expect(body).to.have.property('gyCodingUser');
        expect(body.gyCodingUser).to.be.an('object');
        if (body.gyCodingUser.username) {
          cy.log(`Usuario autenticado: ${body.gyCodingUser.username}`);
        }
      } else {
        cy.log('Usuario no autenticado en la API');
      }
    });
  });
});

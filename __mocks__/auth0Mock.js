const getSession = jest.fn();

// Mock para Auth0Client del servidor
class Auth0Client {
  constructor() {
    this.middleware = jest.fn((req, res) => {
      // Mock básico del middleware
      return { req, res };
    });
  }
}

module.exports = {
  getSession,
  Auth0Client,
};

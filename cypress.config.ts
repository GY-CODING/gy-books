import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      AUTH0_USERNAME: process.env.AUTH0_USERNAME,
      AUTH0_PASSWORD: process.env.AUTH0_PASSWORD,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    },
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});

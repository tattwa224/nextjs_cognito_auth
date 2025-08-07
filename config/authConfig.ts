/**
 * Authentication configuration
 *
 * This file contains settings used to control authentication behavior.
 * Auth bypass should be used only in local development.
 */

const ENABLE_AUTH_BYPASS = true; // ⛔ Set to false before deploying to production

// Guard against enabling bypass in production
if (process.env.NODE_ENV !== 'development' && ENABLE_AUTH_BYPASS) {
  throw new Error('🚨 Auth bypass should never be enabled in production!');
}

export const authConfig = {
  bypassAuth: ENABLE_AUTH_BYPASS,
  mockUser: {
    username: 'dev-admin',
    attributes: {
      email: 'dev@example.com',
      // You can extend this with roles, orgId, etc.
    },
  },
};

// Jest setup file to configure environment variables for testing
process.env.STAGE = 'local';
process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

// Database configuration for local environment
process.env.DB_HOST_LOCAL = 'localhost';
process.env.DB_PORT_LOCAL = '5432';
process.env.DB_USERNAME_LOCAL = 'omninode_user';
process.env.DB_PASSWORD_LOCAL = 'omninode_password';
process.env.DB_NAME_LOCAL = 'omninode_local';
process.env.DB_SCHEMA = 'public';

// Additional environment variables that might be required
process.env.DATABASE_URL = 'postgresql://omninode_user:omninode_password@localhost:5432/omninode_local';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'omninode_local';
process.env.DB_USER = 'omninode_user';
process.env.DB_PASSWORD = 'omninode_password'; 
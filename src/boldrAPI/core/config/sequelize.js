module.exports = {
  development: {
    use_env_variable: 'POSTGRES_DB_URL',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'boldr_development',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'POSTGRES_DB_URL',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || null,
    database: process.env.POSTGRES_DB || 'travis_ci_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'POSTGRES_DB_URL',
    username: process.env.POSTGRES_USER || 'postgres',
    password: null,
    database: 'boldr',
    host: '127.0.0.1',
    dialect: 'postgres'
  }
};
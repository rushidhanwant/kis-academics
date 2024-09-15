// Update with your config settings.
import pgConnectionString from 'pg-connection-string'
import config from './src/config'

const connectionOptions = pgConnectionString.parse(config.db.url || '')

module.exports = {
  client: 'pg',
  connection: {
    host: connectionOptions.host,
    port: connectionOptions.port,
    database: connectionOptions.database,
    user: connectionOptions.user,
    password: connectionOptions.password,
    ssl: connectionOptions.ssl
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

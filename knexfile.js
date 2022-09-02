const path = require("path");

module.exports ={
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "root",
      database: "db_apiusers",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.join(path.resolve(), "./database/migrations/"),
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "root",
      database: "db_apiusers",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: path.join(path.resolve(), "./database/migrations/"),
    },
  },
};

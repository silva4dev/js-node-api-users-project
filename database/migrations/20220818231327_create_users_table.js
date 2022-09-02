export function up(knex, Promise) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name", 50).notNullable();
    table.string("email", 150).unique().notNullable();
    table.string("password", 200).notNullable();
    table.integer("role").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex, Promise) {
  return knex.schema.dropTable("users");
}

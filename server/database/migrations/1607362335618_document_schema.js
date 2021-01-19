"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DocumentSchema extends Schema {
  up() {
    this.table("documents", (table) => {
      table.integer("signed_by").nullable();
      table
        .integer("signed_by")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("SET NULL")
        .onDelete("SET NULL")
        .alter();
    });
  }

  down() {
    this.table("documents", (table) => {
      // reverse alternations
    });
  }
}

module.exports = DocumentSchema;

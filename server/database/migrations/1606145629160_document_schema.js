"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DocumentSchema extends Schema {
  up() {
    this.table("documents", (table) => {
      table.integer("event_id").nullable();
      table
        .integer("event_id")
        .unsigned()
        .references("id")
        .inTable("events")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
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

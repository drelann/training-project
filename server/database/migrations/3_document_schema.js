"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DocumentSchema extends Schema {
  up() {
    this.create("documents", (table) => {
      table.increments();
      table.string("title", 80).notNullable();
      //table.foreign("event_id").references("Events.id");
      table.date("day").nullable();
      table.text("content").nullable();
      table.boolean("signed").nullable();
      table.string("destination").nullable();
      table.string("availability").nullable();
    });
  }

  down() {
    this.drop("documents");
  }
}

module.exports = DocumentSchema;

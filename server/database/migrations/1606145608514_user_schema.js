"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.table("users", (table) => {
      //table.integer("event_id").nullable();
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
    this.table("users", (table) => {
      // reverse alternations
    });
  }
}

module.exports = UserSchema;

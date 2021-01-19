"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table
        .integer("country")
        .unsigned()
        .references("id")
        .inTable("countries")
        .onUpdate("SET NULL")
        .onDelete("SET NULL")
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

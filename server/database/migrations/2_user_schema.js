"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("firstname", 80).notNullable();
      table.string("lastname", 80).notNullable().unique();
      table.string("country", 254).notNullable();
      table.string("email", 60).notNullable().unique();
      table.text("about").notNullable();
      table.string("userpic", 254).notNullable();
      table.string("PIN", 4).notNullable();
      table.string("password", 60).notNullable();
      table.string("role", 30).notNullable();
      //table.foreign("event_id").references("Events.id");
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;

"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ClientSchema extends Schema {
  up() {
    this.create("clients", (table) => {
      table.increments();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("phone", 12).notNullable();
      table.date("date_of_birth").nullable();
    });
  }

  down() {
    this.drop("clients");
  }
}

module.exports = ClientSchema;

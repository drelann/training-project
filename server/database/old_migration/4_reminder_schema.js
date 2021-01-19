"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ReminderSchema extends Schema {
  up() {
    this.create("reminders", (table) => {
      table.increments();
      table.integer("client_id").unsigned();
      table.foreign("client_id").references("Clients.id");
      table.text("description");
      table.date("date_of_remind");
    });
  }

  down() {
    this.drop("reminders");
  }
}

module.exports = ReminderSchema;

"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EventSchema extends Schema {
  up() {
    this.create("events", (table) => {
      table.increments();
      table.string("title", 80).notNullable();
      table.string("eventpic", 254).notNullable();
      table.date("start_date").nullable();
      table.date("c1_date").nullable();
      table.date("c_plus_1_date").nullable();
      table.date("finish_date").nullable();
    });
  }

  down() {
    this.drop("events");
  }
}

module.exports = EventSchema;
